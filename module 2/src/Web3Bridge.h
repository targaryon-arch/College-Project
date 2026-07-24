#ifndef WEB3_BRIDGE_H
#define WEB3_BRIDGE_H

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "WaterConfig.h"

class Web3Bridge {
private:
    const char* m_ssid;
    const char* m_password;
    const char* m_apiUrl;

public:
    Web3Bridge(const char* ssid, const char* password, const char* apiUrl)
        : m_ssid(ssid), m_password(password), m_apiUrl(apiUrl) {}

    void connectWiFi() {
        if (WiFi.status() == WL_CONNECTED) return;

        Serial.print("Connecting to WiFi: ");
        Serial.println(m_ssid);
        WiFi.begin(m_ssid, m_password);

        while (WiFi.status() != WL_CONNECTED) {
            delay(500);
            Serial.print(".");
        }
        Serial.println("\nWiFi Connected successfully!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
    }

    bool transmitWaterUsage(const char* walletAddress, float litersDeducted) {
        if (litersDeducted <= 0.001) return false; // Ignore zero usage to save bandwidth
        
        if (WiFi.status() != WL_CONNECTED) {
            connectWiFi();
        }

        HTTPClient http;
        http.begin(m_apiUrl);
        http.addHeader("Content-Type", "application/json");

        // Format data into standard JSON packet
        JsonDocument doc;
        doc["walletAddress"] = walletAddress;
        doc["litersUsed"] = litersDeducted;

        String requestBody;
        serializeJson(doc, requestBody);

        Serial.print("Transmitting Web3 Payload: ");
        Serial.println(requestBody);

        int httpResponseCode = http.POST(requestBody);
        bool success = false;

        if (httpResponseCode > 0) {
            Serial.print("Server Response Code: ");
            Serial.println(httpResponseCode);
            if (httpResponseCode == 200 || httpResponseCode == 201) {
                success = true;
            }
        } else {
            Serial.print("Error sending transmission POST request: ");
            Serial.println(http.errorToString(httpResponseCode).c_str());
        }

        http.end();
        return success;
    }
};

#endif