#ifndef WATER_HARDWARE_H
#define WATER_HARDWARE_H

#include <Arduino.h>
#include "WaterConfig.h"

class WaterHardware {
private:
    int m_sensorPin;
    int m_pumpPin;
    float m_calibrationFactor;
    unsigned long m_oldTime;
    float m_totalLiters;
    
    // Naya aur professional tareeqa: Pointer as an argument
    static void IRAM_ATTR pulseCounterISR(void* arg) {
        WaterHardware* instance = static_cast<WaterHardware*>(arg);
        instance->m_pulseCount++;
    }

public:
    volatile uint16_t m_pulseCount;

    WaterHardware(int sensorPin, int pumpPin, float calibrationFactor)
        : m_sensorPin(sensorPin), m_pumpPin(pumpPin), m_calibrationFactor(calibrationFactor),
          m_pulseCount(0), m_oldTime(0), m_totalLiters(0.0) {
    }

    void begin() {
        pinMode(m_sensorPin, INPUT_PULLUP);
        pinMode(m_pumpPin, OUTPUT);
        digitalWrite(m_pumpPin, LOW); // Ensure pump is turned off initially
        
        // attachInterruptArg use kar ke pointer pass kiya
        attachInterruptArg(digitalPinToInterrupt(m_sensorPin), pulseCounterISR, this, FALLING);
        m_oldTime = millis();
    }

    void turnOnPump() {
        digitalWrite(m_pumpPin, HIGH);
    }

    void turnOffPump() {
        digitalWrite(m_pumpPin, LOW);
    }

    float calculateLitersConsumed() {
        if ((millis() - m_oldTime) > 1000) { // Read data once per second
            detachInterrupt(digitalPinToInterrupt(m_sensorPin));
            
            float flowRate = ((1000.0 / (millis() - m_oldTime)) * m_pulseCount) / m_calibrationFactor;
            m_oldTime = millis();
            
            float currentLiters = (flowRate / 60.0);
            
            m_totalLiters += currentLiters;
            m_pulseCount = 0;
            
            // Dobara attachInterruptArg
            attachInterruptArg(digitalPinToInterrupt(m_sensorPin), pulseCounterISR, this, FALLING);
            return currentLiters;
        }
        return 0.0;
    }

    float getTotalLiters() const {
        return m_totalLiters;
    }
};

#endif