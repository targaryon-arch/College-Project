#include <Arduino.h>
#include "WaterConfig.h"
#include "WaterHardware.h"
#include "Web3Bridge.h"

// Instantiate the classes as distinct objects
WaterHardware waterSystem(FLOW_SENSOR_PIN, PUMP_RELAY_PIN, SENSOR_CALIBRATION_FACTOR);
Web3Bridge networkBridge(WIFI_SSID, WIFI_PASSWORD, BACKEND_API_URL);

unsigned long lastTransmissionTime = 0;
const unsigned long transmissionInterval = 5000; // Transmit batch data to the ledger every 5 seconds
float accumulatedLiters = 0.0;

void setup() {
    Serial.begin(115200);
    
    // Initialize Hardware Components
    waterSystem.begin();
    
    // Initialize Wi-Fi Connection
    networkBridge.connectWiFi();
    
    // Boot up the water motor pump
    Serial.println("Initialization complete. Activating water distribution pump...");
    waterSystem.turnOnPump();
}

void loop() {
    // Continuously calculate real-time volumetric consumption from the sensor
    accumulatedLiters += waterSystem.calculateLitersConsumed();

    // Send data batches at regular intervals to maintain network stability
    if (millis() - lastTransmissionTime >= transmissionInterval) {
        Serial.print("Current Session Total: ");
        Serial.print(waterSystem.getTotalLiters());
        Serial.println(" Liters.");

        if (accumulatedLiters > 0.0) {
            bool txSuccess = networkBridge.transmitWaterUsage(FARMER_WALLET_ADDRESS, accumulatedLiters);
            if (txSuccess) {
                accumulatedLiters = 0.0; // Clear the batch buffer upon confirmed delivery
            }
        }
        lastTransmissionTime = millis();
    }
}