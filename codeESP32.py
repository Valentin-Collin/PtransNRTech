import network
import utime
from umqtt.simple import MQTTClient
from machine import Pin
import time
from machine import Pin, SoftI2C
import requests

WiFi_SSID = "Galaxy A33 5GACC9"
WiFi_PASS = "finlande"
SERVER = "mqtt3.thingspeak.com"
PORT = 1883
CHANNEL_ID = "2410212"
USER = "USER_ID"
CLIENT_ID = "Clien_ID"
PASSWORD = "Password"

# Dynamically set the field based on the field you want to publish
topicOut = "channels/" + CHANNEL_ID + "/publish"

i2c = SoftI2C(scl=Pin(14), sda=Pin(12), freq=40000)
STATUS_BITS_MASK = 0xFFFC
data = []
address = 64

def get_temp():
    i2c.writeto(address, b'\xF3')
    utime.sleep_ms(85)
    data = i2c.readfrom(address, 2)
    adjusted = (data[0] << 8) + data[1]
    adjusted &= STATUS_BITS_MASK
    adjusted *= 175.12
    adjusted /= 1 << 16
    adjusted -= 46.85
    return adjusted

def average_temperature(num_samples=5):
    temperatures = []
    for _ in range(num_samples):
        temp = get_temp()
        if -10 < temp < 50:
            temperatures.append(temp)
    if temperatures:
        return sum(temperatures) / len(temperatures)
    else:
        return None

def wifi_connect():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('Connecting to network...')
        wlan.connect(WiFi_SSID, WiFi_PASS)
        while not wlan.isconnected():
            pass
    print("Connected to Wifi Router")
    
def callback(topic,msg):
    print(topic)
    print(msg)

wifi_connect()

client = MQTTClient(CLIENT_ID, SERVER, PORT, USER, PASSWORD, 60)
client.set_callback(callback)
client.connect()

print("MQTT connected")
current_frequency = None  # Variable pour stocker la fréquence actuelle

while True:
    # Get frequency from ThingSpeak
    api_key = "1UBZZWF2IZVHKLBA"
    api_url = f"https://api.thingspeak.com/channels/2410212/fields/2/last.json?api_key={api_key}"
    response = requests.get(api_url)
    data = response.json()
    
    print("Data from ThingSpeak:", data)
    
    if "field2" in data:
        frequency_str = data["field2"]
        new_frequency = int(frequency_str)
        print("Frequency from ThingSpeak:", new_frequency)

        # Vérifier si la fréquence actuelle est différente de la nouvelle fréquence
        if new_frequency != current_frequency:
            current_frequency = new_frequency
            print("Updating frequency to:", current_frequency)

        avg_temp = average_temperature(num_samples=5)
        if avg_temp is not None:
            # Arrondir la température moyenne à deux décimales
            rounded_temp = round(avg_temp, 2)
            print("Average temperature:", rounded_temp)
            # Publier la température arrondie sur ThingSpeak
            client.publish(topicOut, "field1=" + str(rounded_temp))

        else:
            print("No valid temperature readings obtained.")

    else:
        print("Error: 'field2' not found in data")

    # Attendre pour le temps spécifié dans la fréquence actuelle
    if current_frequency is not None:
        time.sleep(current_frequency)
