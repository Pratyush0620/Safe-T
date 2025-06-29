import json
import paho.mqtt.client as mqtt
from concentration_monitor import air_status
from predict_params import predict_using_model
from blackbox_ai import get_status

# ---------------- Factory Functions and Globals ----------------
# Factory vitals globals (dynamically updated)
status = None
surtemp = None
surhumid = None



def process_factory_data(temp, humid, aqiscore, CO2, benzene, Ammonia, Alcohol):
    global surtemp, surhumid, status
    # Update factory vitals from MQTT message
    surtemp = temp
    surhumid = humid

    fact_dict = {
        "aqiscore": aqiscore,
        "CO2": CO2,
        "benzene": benzene,
        "Ammonia": Ammonia,
        "Alcohol": Alcohol
    }

    print(fact_dict, end="\n")
    print(f"\n🌡 Factory Vitals Updated: Temp: {temp}°C, Humid: {humid}%, AQI: {aqiscore}")
    # Calculate factory status dynamically using air_status function
    status = air_status(fact_dict)
    print(status)


# ---------------- Band Functions and Globals ----------------
# Dictionary to store vitals per band
band_vitals = {}

# Precompute band parameters using the model
band_params = {}
band_params["band1"] = predict_using_model(0, 0, 0, 1, 1)
band_params["band2"] = predict_using_model(1, 0, 1, 1, 0)
print(band_params["band1"])
print(band_params["band2"])


def process_band_data(band, heart_rate, spo2, body_temp, client):
    res = dict(band_params[band])  # Get band-specific parameters from the model
    global status, surtemp, surhumid

    print(f"\n📡 Processing {band} vitals:")
    print(f"Heart Rate: {heart_rate}, SpO2: {spo2}, Body Temp: {body_temp}")
    print(f"Factory: Temp: {surtemp}°C, Humidity: {surhumid}%")

    # Determine worker's status based on both band and factory data
    band_status = get_status(
        surtemp, surhumid, heart_rate, spo2, body_temp,
        res["Surrounding_upper_temp"], res["Surrounding_lower_temp"],
        res["Humidity_Upper"], res["Humidity_Lower"],
        res["Heart_Rate_Upper"], res["Heart_Rate_Lower"],
        res["SpO2_Upper"], res["SpO2_Lower"],
        res["Body_Temp_Upper"], res["Body_Temp_lower"], res["gender"]
    )
    final_status = max(status, band_status)
    print(f"🚦 Status for {band}: {final_status}")

    # Publish status
    status_topic = f"SAFET/{band}/status"
    status_message = json.dumps({"status": final_status})
    client.publish(status_topic, status_message)
    print(f"✅ Published: {status_message} → {status_topic}")


# ---------------- MQTT Callbacks ----------------
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT Broker")
        # Subscribe to all topics under SAFET/ with a trailing /vitals
        client.subscribe("SAFET/+/vitals")
    else:
        print(f"❌ Connection failed with error code {rc}")


def on_message(client, userdata, msg):
    try:
        topic_parts = msg.topic.split('/')
        identifier = topic_parts[1].lower()

        # Check if this is a factory update message
        if identifier == "factory":
            data = json.loads(msg.payload.decode("utf-8"))
            temp = data.get("Temperature", 0)
            humid = data.get("Humidity", 0)
            aqiscore = data.get("AQI_Score", 0)
            CO2 = data.get("CO2_PPM", 0)
            benzene = data.get("Benzene_PPM", 0)
            Ammonia = data.get("Ammonia_PPM", 0)
            Alcohol = data.get("Alcohol_PPM", 0)
            process_factory_data(temp, humid, aqiscore, CO2, benzene, Ammonia, Alcohol)
            return  # Do not continue processing as band data

        # Otherwise, process as band vitals message
        data = json.loads(msg.payload.decode("utf-8"))
        band = identifier  # Use identifier as band (e.g., "band1" or "band2")
        heart_rate = data.get("heart_rate", 0)
        spo2 = data.get("spo2", 0)
        body_temp = data.get("bodyTemp", 0)

        # Update global band vitals dictionary
        band_vitals[band] = {
            "heart_rate": heart_rate,
            "spo2": spo2,
            "body_temp": body_temp
        }
        process_band_data(band, heart_rate, spo2, body_temp, client)

    except json.JSONDecodeError:
        print("❌ Error: Invalid JSON received.")
    except Exception as e:
        print(f"⚠ Error processing message: {e}")


# ---------------- Main ----------------
def main():
    client = mqtt.Client()
    # Set MQTT username and password
    client.username_pw_set("mqtt_username", "mqtt_pass")
    
    client.on_connect = on_connect
    client.on_message = on_message

    mqtt_server = "enter your mqtt broker address"
    mqtt_port = 1883
    try:
        client.connect(mqtt_server, mqtt_port, 60)
        print("🚀 Listening for MQTT messages...")
        client.loop_forever()
    except Exception as e:
        print(f"❌ Error: Unable to connect to MQTT Broker - {e}")
    
if __name__ == "__main__":
    main()