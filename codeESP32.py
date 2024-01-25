import network
import utime
from umqtt.simple import MQTTClient
from machine import Pin
import time
from machine import Pin, SoftI2C

WiFi_SSID = "Galaxy A33 5GACC9"
WiFi_PASS = "finlande"
SERVER = "mqtt3.thingspeak.com"
PORT = 1883
CHANNEL_ID = "2410212"
USER = "ASw3MikoNxkOFTQCBTMkGy0"
CLIENT_ID = "ASw3MikoNxkOFTQCBTMkGy0"
PASSWORD = "BsgDYaU9bkuF3KSsc0Kgm/ky"

# Dynamically set the field based on the field you want to publish
#create topic to publish the message
topicOut = "channels/" + CHANNEL_ID + "/publish" 

#create topic to publish the message
#topicIn = "channels/" + CHANNEL_ID  + "/subscribe/fields/field2"

i2c = SoftI2C(scl=Pin(14), sda=Pin(12), freq=40000)
STATUS_BITS_MASK = 0xFFFC  # Masque pour effacer les bits d'état non pertinents
data = []  # Liste pour stocker les données lues depuis le capteur
address = 64  # Adresse du capteur de température (peut varier selon le capteur)

def get_temp():
    # Envoi de la commande de mesure de température au capteur
    i2c.writeto(address, b'\xF3')
    utime.sleep_ms(85)  # Attente pendant que la mesure est effectuée (85 ms pour la mesure la plus précise)
    data = i2c.readfrom(address, 2)  # Lecture des données de température depuis le capteur
    adjusted = (data[0] << 8) + data[1]  # Combinaison des octets lus pour obtenir une valeur de température
    adjusted &= STATUS_BITS_MASK  # Application du masque pour effacer les bits d'état non pertinents
    adjusted *= 175.12  # Conversion de la valeur en température (175.12 est une constante spécifique au capteur)
    adjusted /= 1 << 16  # Correction de la position de la virgule flottante
    adjusted -= 46.85  # Compensation de la température pour obtenir la valeur finale
    return adjusted  # Retourne la température ajustée



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




#client.subscribe(topicIn)

print("Mqtt connected")
  
while True:
    
    temp = get_temp()
    client.check_msg()
       
    #Publish the topic meaasge to the broker
    client.publish(topicOut, "field1="+str(temp))
    
    time.sleep(60)