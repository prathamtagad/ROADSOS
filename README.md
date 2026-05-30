# 🚨 ROADSOS

**AI-Powered Cross-Border Emergency Response & Road Assistance System**

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud"/>
</p>

## 🌍 The BIMSTEC Road Safety Crisis Solved

ROADSOS is an emergency response and road assistance platform built specifically for the BIMSTEC region's realities: motorcycle-dominated roads, mountain terrain, cross-border movement, multiple messenger ecosystems, and connectivity gaps. 

It is the first emergency system that is **country-aware** — automatically switching emergency contacts, databases, language, and communication channels the moment a user crosses a border (Thailand, Myanmar, Sri Lanka, Nepal, Bangladesh, Bhutan).

## ✨ Key Features

*   🗺️ **BIMSTEC Smart Border Mode:** Silently reconfigures all contacts, databases, and languages via GPS when crossing borders.
*   📡 **100% Offline Mode:** Pre-cached emergency numbers, hospitals, towing, tyre shops, and first aid guidance for zero-connectivity areas.
*   🏍️ **Motorcycle First & Mountain Rescue:** Specialized TFLite crash detection for two-wheelers and altitude-aware emergency features (LZ finder, offline SOS).
*   🤖 **AI First Aid & Messenger Bots:** Gemini-powered first aid guidance and country-specific bot integrations (LINE, WhatsApp, Messenger).
*   🚑 **Comprehensive Road Assist:** Fetches 8 categories of contacts including towing, puncture shops, showrooms, and embassies.
*   🪪 **Tourist & Migrant Worker Profiles:** Lock-screen emergency cards, multi-lingual support, and auto-updating home-country embassy contacts.
*   ⚠️ **Community Hazard Mesh:** Anonymous hazard reporting (floods, landslides, potholes) with cross-verification.

## 🛠️ Technology Stack

*   **Mobile App:** React Native, Expo, Zustand, React Navigation
*   **Backend & DB:** Firebase (Auth, Firestore, Realtime DB, Cloud Functions, Cloud Messaging)
*   **AI & Mapping:** Google AI Studio (Gemini API), Google Maps Platform, Turf.js, TFLite
*   **Offline Data:** Expo SQLite, OpenStreetMap tiles, SRTM elevation data

## 🚀 Quick Start

### Prerequisites
*   Node.js (v18+)
*   npm or yarn
*   Expo CLI (`npm i -g expo-cli`)

### Installation

1.  **Install Dependencies** (from the repo root)
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Environment variables are managed locally. Ensure you have your `.env` configured in `apps/mobile/.env` with your Firebase and API credentials.
    *(Secrets are securely injected at runtime via `app.config.js` and ignored by Git).*

3.  **Start the Mobile App**
    ```bash
    npm run mobile
    ```

4.  **Start Firebase Emulators (Local Development)**
    ```bash
    npm run emulators
    ```

## 📂 Project Structure

This project is organized as a monorepo:

*   **`apps/mobile/`**: The core React Native/Expo application source code.
*   **`firebase/`**: Firebase Cloud Functions, Security Rules, and Emulator configurations.
*   **`ROADSOS_PRD_BIMSTEC_v4.md`**: The complete Product Requirements Document detailing the system architecture and features.

## 💡 Notes

*   The HTML UI files in the workspace root are design references and prototypes.
*   The application is designed to operate primarily on free-tier services (Firebase, Google AI Studio) to ensure sustainability during pilot phases.

---
*Built for the Road Safety Hackathon 2026*
