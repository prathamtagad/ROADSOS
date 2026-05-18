const EMERGENCY_NUMBERS = {
  TH: { ambulance: "1669", police: "191", fire: "199", touristPolice: "1155", highway: "1193" },
  MM: { ambulance: "192", police: "199", fire: "191", touristPolice: null, highway: null },
  LK: { ambulance: "1990", police: "118", fire: "110", touristPolice: "1912", highway: "1938" },
  NP: { ambulance: "102", police: "100", fire: "101", touristPolice: "1144", highway: "103" },
  BD: { ambulance: "199", police: "999", fire: "199", touristPolice: null, highway: null },
  BT: { ambulance: "112", police: "110", fire: "110", touristPolice: null, highway: "113" }
};

const COUNTRY_MESSENGER_MAP = {
  TH: "line",
  MM: "messenger",
  LK: "whatsapp",
  NP: "whatsapp",
  BD: "whatsapp",
  BT: "whatsapp"
};

module.exports = {
  EMERGENCY_NUMBERS,
  COUNTRY_MESSENGER_MAP
};
