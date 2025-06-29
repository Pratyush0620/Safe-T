import paho.mqtt.client as mqtt
import json
from concentration_monitor import air_status

# Global variables to store factory vitals
surtemp = 0  # Initialized to a default safe value
surhumid = 0
status = 0

# Placeholder function
def get_fact_status():
    return surtemp, surhumid, status  # Ensures unpacking always works

def on_connect(client, userdata, flags, rc):
    print("✅ Connected with result code " + str(rc))
    client.subscribe("SAFET/factory/vitals")

def process_factory_data(temp, humid, aqiscore, CO2, benzene, Ammonia, Alcohol):
    global surtemp, surhumid, status, get_fact_status

    # Update factory vitals from MQTT message
    surtemp = temp if temp is not None else 0
    surhumid = humid if humid is not None else 0

    fact_dict = {
        "aqiscore": aqiscore if aqiscore is not None else 0,
        "CO2": CO2 if CO2 is not None else 0,
        "benzene": benzene if benzene is not None else 0,
        "Ammonia": Ammonia if Ammonia is not None else 0,
        "Alcohol": Alcohol if Alcohol is not None else 0
    }

    print("\n🌡 Factory Vitals Updated:")
    print(f"Temp: {surtemp}°C, Humid: {surhumid}%, AQI: {fact_dict['aqiscore']}")

    # Calculate factory status dynamically
    status = air_status(fact_dict)

    # Assign a new function dynamically
    def get_fact_status2():
        return surtemp, surhumid, status

    get_fact_status = get_fact_status2  # Now it returns actual values


def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode('utf-8'))
        temp = data.get("Temperature", 0)
        humid = data.get("Humidity", 0)
        aqiscore = data.get("AQI_Score", 0)
        CO2 = data.get("CO2_PPM", 0)
        benzene = data.get("Benzene_PPM", 0)
        Ammonia = data.get("Ammonia_PPM", 0)
        Alcohol = data.get("Alcohol_PPM", 0)

        # Process and update factory data dynamically
        process_factory_data(temp, humid, aqiscore, CO2, benzene, Ammonia, Alcohol)

    except json.JSONDecodeError:
        print("❌ Error: Invalid JSON format.")
    except Exception as e:
        print(f"⚠️ Error processing message: {e}")

def main():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    mqtt_server = "test.mosquitto.org"
    try:
        client.connect(mqtt_server, 1883, 60)
        print("🚀 Listening for MQTT messages...")
        client.loop_forever()
    except Exception as e:
        print(f"❌ Error: Unable to connect to MQTT Broker - {e}")

if __name__ == "__main__":
    main()
