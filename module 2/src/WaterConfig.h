#ifndef WATER_CONFIG_H
#define WATER_CONFIG_H

// Network Credentials (Yahan apne internet ki details likhein)
const char* const WIFI_SSID = "Sheikh"; 
const char* const WIFI_PASSWORD = "12345678";

// RPC URL (Internet ki sarak jo Blockchain tak jayegi)
const char* const BACKEND_API_URL = "https://eth-sepolia.g.alchemy.com/v2/Cxf1X5k0RQw5H7hsvDpgx";

// Blockchain Contract Addresses (Jo dost ne Sepolia par deploy kiye hain)
const char* const TOKEN_CONTRACT = "0xabBF9eeC80E09AaDEAf4947Ce1cb44592f9898E4";
const char* const MARKETPLACE_CONTRACT = "0x2Ec04419EE89770d922eDA45EA0dB46267a0709A";

// Hardware Pins
const int FLOW_SENSOR_PIN = 4; // Sensor yellow wire to GPIO 4
const int PUMP_RELAY_PIN = 5;  // Pump relay signal to GPIO 5

// System Settings
const float SENSOR_CALIBRATION_FACTOR = 7.5; 

// Jis kisan ko token milne hain, uska wallet address (Agar apna MetaMask hai toh yahan dal dein)
const char* const FARMER_WALLET_ADDRESS = "0xYourFarmersPublicWalletAddressHere";

#endif