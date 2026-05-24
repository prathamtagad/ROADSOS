import path from "path";
import { config as dotenvConfig } from "dotenv";

const withAndroidGradleProps = require("./plugins/withAndroidGradleProps");

dotenvConfig({ path: path.join(__dirname, ".env") });

export default ({ config }) => ({
  ...config,
  name: "ROADSOS",
  slug: "roadsos",
  scheme: "roadsos",
  plugins: [
    ...(config.plugins || []),
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          minSdkVersion: 24,
          kotlinVersion: "1.9.24"
        }
      }
    ],
    withAndroidGradleProps
  ],
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
    eas: {
      projectId: "9978dedf-51a9-4e19-9dda-cdb224745b56"
    },
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
