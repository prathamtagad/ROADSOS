export type CountryMessenger = "line" | "messenger" | "whatsapp";

export type Country = {
  code: string;
  name: string;
  flag: string;
  language: string;
  ambulance: string | null;
  police: string | null;
  fire: string | null;
  touristPolice: string | null;
  highway: string | null;
  messenger: CountryMessenger;
  dialCode: string;
};

export const BIMSTEC_COUNTRIES: Country[] = [
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    language: "hi",
    ambulance: "108",
    police: "100",
    fire: "101",
    touristPolice: "1363",
    highway: "1033",
    messenger: "whatsapp",
    dialCode: "+91",
  },
  {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    language: "th",
    ambulance: "1669",
    police: "191",
    fire: "199",
    touristPolice: "1155",
    highway: "1193",
    messenger: "line",
    dialCode: "+66",
  },
  {
    code: "MM",
    name: "Myanmar",
    flag: "🇲🇲",
    language: "my",
    ambulance: "192",
    police: "199",
    fire: "191",
    touristPolice: null,
    highway: null,
    messenger: "messenger",
    dialCode: "+95",
  },
  {
    code: "LK",
    name: "Sri Lanka",
    flag: "🇱🇰",
    language: "si",
    ambulance: "1990",
    police: "118",
    fire: "110",
    touristPolice: "1912",
    highway: "1938",
    messenger: "whatsapp",
    dialCode: "+94",
  },
  {
    code: "NP",
    name: "Nepal",
    flag: "🇳🇵",
    language: "ne",
    ambulance: "102",
    police: "100",
    fire: "101",
    touristPolice: "1144",
    highway: "103",
    messenger: "whatsapp",
    dialCode: "+977",
  },
  {
    code: "BD",
    name: "Bangladesh",
    flag: "🇧🇩",
    language: "bn",
    ambulance: "199",
    police: "999",
    fire: "199",
    touristPolice: null,
    highway: null,
    messenger: "whatsapp",
    dialCode: "+880",
  },
  {
    code: "BT",
    name: "Bhutan",
    flag: "🇧🇹",
    language: "dz",
    ambulance: "112",
    police: "110",
    fire: "110",
    touristPolice: null,
    highway: "113",
    messenger: "whatsapp",
    dialCode: "+975",
  },
];

export const OTHER_COUNTRIES: Country[] = [
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    language: "en",
    ambulance: "911",
    police: "911",
    fire: "911",
    touristPolice: null,
    highway: null,
    messenger: "whatsapp",
    dialCode: "+1",
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    language: "en",
    ambulance: "999",
    police: "999",
    fire: "999",
    touristPolice: null,
    highway: null,
    messenger: "whatsapp",
    dialCode: "+44",
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    language: "en",
    ambulance: "000",
    police: "000",
    fire: "000",
    touristPolice: null,
    highway: null,
    messenger: "whatsapp",
    dialCode: "+61",
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    language: "en",
    ambulance: "995",
    police: "999",
    fire: "995",
    touristPolice: null,
    highway: null,
    messenger: "whatsapp",
    dialCode: "+65",
  },
  {
    code: "MY",
    name: "Malaysia",
    flag: "🇲🇾",
    language: "ms",
    ambulance: "999",
    police: "999",
    fire: "994",
    touristPolice: null,
    highway: null,
    messenger: "whatsapp",
    dialCode: "+60",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    language: "ar",
    ambulance: "998",
    police: "999",
    fire: "997",
    touristPolice: null,
    highway: null,
    messenger: "whatsapp",
    dialCode: "+971",
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    language: "de",
    ambulance: "112",
    police: "110",
    fire: "112",
    touristPolice: null,
    highway: null,
    messenger: "whatsapp",
    dialCode: "+49",
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    language: "ja",
    ambulance: "119",
    police: "110",
    fire: "119",
    touristPolice: null,
    highway: null,
    messenger: "whatsapp",
    dialCode: "+81",
  },
];

export const ALL_COUNTRIES: Country[] = [
  ...BIMSTEC_COUNTRIES,
  ...OTHER_COUNTRIES,
];

export const getCountry = (code: string): Country => {
  const normalized = code.trim().toUpperCase();
  return (
    ALL_COUNTRIES.find((country) => country.code === normalized) ??
    BIMSTEC_COUNTRIES[0]
  );
};
