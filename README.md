# **SAFE-T: Real-Time Health & Safety Monitoring System**  


SAFE-T Band is an **IoT-powered real-time health & safety monitoring system** designed to enhance **worker safety** in **industrial environments**. It continuously tracks **vital signs**, detects **emergencies**, and provides **instant alerts** using **ESP32, MQTT, AI, and a Spring Boot-powered dashboard**.  

---

## **📌 Key Features**  

✅ **Real-time health monitoring**  
- Tracks **heart rate & SpO2** using **MAX30102** sensor.  
- Monitors **body temperature** for safety assessment.  

✅ **Emergency SOS Alerts**  
- Integrated **TP223 touch button** for instant distress signals.  

✅ **AI-Powered Health & Safety Analysis**  
- Uses **machine learning** to assess health risks.  
- Classifies worker status: **Green (Safe), Blue (Warning), Red (Critical)**.  

✅ **Factory Environment Monitoring**  
- Measures **air quality** via **gas sensor**.  
- Monitors **temperature & humidity** using **DHT11**.  

✅ **Seamless Real-time Communication**  
- **MQTT-based messaging** ensures instant data exchange.  

✅ **Comprehensive Admin Dashboard**  
- Centralized **Spring Boot & React.js** dashboard for monitoring alerts & reports.  

---

## **🛠️ Technologies Used**  

| **Technology** | **Purpose** |
|--------------|------------|
| **ESP32** | Microcontroller for sensor data collection & alerts |
| **MQTT (Mosquitto Broker)** | Real-time communication between devices & AI |
| **Python AI Server** | Health analysis & risk assessment based on sensor data |
| **Spring Boot** | Backend API for admin functionalities & data processing |
| **React.js** | Interactive web-based admin dashboard |
| **Raspberry Pi** | Hosts AI processing & MQTT broker for seamless data exchange |

---

## **📷 System Overview**  

![System Workflow](https://i.imghippo.com/files/KxCL6387kHw.jpg)

---

## **🚀 Getting Started**  

### **1️⃣ Hardware Setup**  
- Connect **ESP32** with **MAX30102, TP223, Gas Sensor, DHT11**.  
- Configure **MQTT broker** on **Raspberry Pi** or cloud.  

### **2️⃣ Software & Backend**  
- Deploy **Spring Boot API** for handling data.  
- Set up **MQTT broker** for communication.  
- Run **Python AI server** for real-time health assessment.  

### **3️⃣ Frontend & Dashboard**  
- Launch **React.js dashboard** for live monitoring.  

---
## 🎥 Video Demo  

[![Watch the Video](https://img.youtube.com/vi/wqHHFJp8-tE/maxresdefault.jpg)](https://www.youtube.com/watch?v=wqHHFJp8-tE)  

🔹 Click on the thumbnail above to watch the **SAFE-T Band in Action**!  
