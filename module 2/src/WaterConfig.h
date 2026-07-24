#ifndef WATER_CONFIG_H
#define WATER_CONFIG_H

// Network Credentials
const char* const WIFI_SSID = "Your_WiFi_Name";
const char* const WIFI_PASSWORD = "Your_WiFi_Password";

// Backend Link (Student 1/3 provides this)
const char* const BACKEND_API_URL = "http://your-backend-or-rpc-ip:5000/api/water/deduct";

// Hardware Pins
const int FLOW_SENSOR_PIN = 4; // Sensor yellow wire to GPIO 4
const int PUMP_RELAY_PIN = 5;   // Pump relay signal to GPIO 5

// System Settings
const float SENSOR_CALIBRATION_FACTOR = 7.5; 
const char* const FARMER_WALLET_ADDRESS = "0xYourFarmersPublicWalletAddressHere";

#endif