import { COUNTRY_MESSENGER_MAP } from "../constants/hardcoded";

export function getMessengerPlatform(country) {
  return COUNTRY_MESSENGER_MAP[country] || "whatsapp";
}
