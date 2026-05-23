import path from "path";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: path.join(__dirname, ".env") });

export default ({ config }) => ({
  ...config,
  name: "ROADSOS",
  slug: "roadsos",
  scheme: "roadsos",
  android: {
    package: "com.roadsos",
    googleServicesFile: "./google-services.json",
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || ""
      }
    }
  },
  ios: {
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
    }
  },
  extra: {
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY || "",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.FIREBASE_APP_ID || "",
      measurementId: process.env.FIREBASE_MEASUREMENT_ID || ""
    },
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID || "",
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || ""
  }
});
