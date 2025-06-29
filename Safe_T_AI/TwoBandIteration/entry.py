
import json
import paho.mqtt.client as mqtt
from predict_params import predict_using_model
from blackbox_ai import get_status
from factoryiot import get_fact_status  # ✅ Import latest factory vitals

# Dictionary to store vitals per band
band_vitals = {}

# Precompute band parameters using the model
band_params = {}

band_params["band1"] = predict_using_model(0, 0, 0, 1, 1)
band_params["band2"] = predict_using_model(1, 0, 1, 1, 0)



def process_band_data(band, heart_rate, spo2, body_temp, client):
    res = dict(band_params[band])  # Get model prediction for the band
    fact_status, surtemp, surhumid = get_fact_status()  # ✅ Get latest factory vitals

    print(f"\n📡 Processing {band} vitals:")
    print(f"Heart Rate: {heart_rate}, SpO2: {spo2}, Body Temp: {body_temp}")
    print(f"Factory: Temp={surtemp}°C, Humidity={surhumid}%")

    # Determine worker's status
    status = get_status(
        surtemp, surhumid, heart_rate, spo2, body_temp,
        res["Surrounding_upper_temp"], res["Surrounding_lower_temp"],
        res["Humidity_Upper"], res["Humidity_Lower"],
        res["Heart_Rate_Upper"], res["Heart_Rate_Lower"],
        res["SpO2_Upper"], res["SpO2_Lower"],
        res["Body_Temp_Upper"], res["Body_Temp_lower"], res["gender"]
        )

    # Overall status considering factory conditions
    final_status = max(fact_status, status)

    print(f"🚦 Status for {band}: {final_status}")

    # Publish status
    status_topic = f"SAFET/{band}/status"
    status_message = json.dumps({"status": final_status})
    client.publish(status_topic, status_message)
    print(f"✅ Published: {status_message} → {status_topic}")



def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT Broker")
        client.subscribe("SAFET/+/vitals")  # Subscribe to all bands
    else:
        print(f"❌ Connection failed with error code {rc}")


def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode("utf-8"))
        topic_parts = msg.topic.split('/')
        band = topic_parts[1]  # Extract band identifier
        if band=='factory':
            return

        # Extract vital parameters safely
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
        print(f"⚠️ Error processing message: {e}")


def main():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    mqtt_server = "test.mosquitto.org"
    try:
        client.connect(mqtt_server, 1883, 60)  # Connect to MQTT broker
        print("🚀 Listening for band vitals...")
        client.loop_forever()
    except Exception as e:
        print(f"❌ Error: Unable to connect to MQTT Broker - {e}")


if __name__ == "__main__":
    main()
