# 🚨 ROADSOS

**AI-Powered Cross-Border Emergency Response & Road Assistance System**

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud"/>
</p>

## 🌍 The BIMSTEC Road Safety Crisis Solved

ROADSOS is an emergency response and road assistance platform built for real-world road safety challenges: motorcycle-dominated roads, mountain terrain, cross-border movement, multiple messenger ecosystems, and connectivity gaps.

It is the first emergency system that is **country-aware** — automatically switching emergency contacts, databases, language, and communication channels the moment a user crosses a border. Default country: **India 🇮🇳**. Supports **15 countries** across the BIMSTEC region and globally.

## ✨ Key Features

*   🗺️ **Smart Border Mode:** Silently reconfigures all contacts, databases, and languages via GPS when crossing borders. Supports 7 BIMSTEC + 8 global countries.
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
    Environment variables are managed locally. Create a `.env` file in `apps/mobile/.env` and add the following keys. 
    *(Secrets are securely injected at runtime via `app.config.js` and ignored by Git).*

    ```env
    # Firebase
    FIREBASE_API_KEY=
    FIREBASE_AUTH_DOMAIN=
    FIREBASE_PROJECT_ID=
    FIREBASE_STORAGE_BUCKET=
    FIREBASE_MESSAGING_SENDER_ID=
    FIREBASE_APP_ID=1:
    FIREBASE_MEASUREMENT_ID=G-

    # Firebase (runtime)
    EXPO_PUBLIC_FIREBASE_API_KEY=
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    EXPO_PUBLIC_FIREBASE_APP_ID=1:
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=

    # APIs
    GEMINI_API_KEY=
    GOOGLE_WEB_CLIENT_ID=
    GOOGLE_REDIRECT_URI=
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
    ```

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

## 🌐 Supported Countries

### BIMSTEC Region (Default)
| Flag | Country | Dial Code | Ambulance | Police | Fire |
|------|---------|-----------|-----------|--------|------|
| 🇮🇳 | **India (Default)** | +91 | 108 | 100 | 101 |
| 🇹🇭 | Thailand | +66 | 1669 | 191 | 199 |
| 🇲🇲 | Myanmar | +95 | 192 | 199 | 191 |
| 🇱🇰 | Sri Lanka | +94 | 1990 | 118 | 110 |
| 🇳🇵 | Nepal | +977 | 102 | 100 | 101 |
| 🇧🇩 | Bangladesh | +880 | 199 | 999 | 199 |
| 🇧🇹 | Bhutan | +975 | 112 | 110 | 110 |

### Global
| Flag | Country | Dial Code | Emergency |
|------|---------|-----------|----------|
| 🇺🇸 | United States | +1 | 911 |
| 🇬🇧 | United Kingdom | +44 | 999 |
| 🇦🇺 | Australia | +61 | 000 |
| 🇸🇬 | Singapore | +65 | 995 / 999 |
| 🇲🇾 | Malaysia | +60 | 999 |
| 🇦🇪 | UAE | +971 | 998 / 999 |
| 🇩🇪 | Germany | +49 | 112 |
| 🇯🇵 | Japan | +81 | 119 / 110 |

## 💡 Notes

*   The HTML UI files in the workspace root are design references and prototypes.
*   The application is designed to operate primarily on free-tier services (Firebase, Google AI Studio) to ensure sustainability during pilot phases.
*   The country selector includes a **search bar** and groups countries into BIMSTEC and Global sections.

---
*Built for the Road Safety Hackathon 2026*
