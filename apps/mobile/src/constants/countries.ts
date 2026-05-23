export type CountryMessenger = "line" | "messenger" | "whatsapp";

export type Country = {
  code: string;
  name: string;
  flag: string;
  language: string;
  ambulance: string | null;
  police: string | null;
  touristPolice: string | null;
  highway: string | null;
  messenger: CountryMessenger;
};

export const BIMSTEC_COUNTRIES: Country[] = [
  {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    language: "th",
    ambulance: "1669",
    police: "191",
    touristPolice: "1155",
    highway: "1193",
    messenger: "line",
  },
  {
    code: "MM",
    name: "Myanmar",
    flag: "🇲🇲",
    language: "my",
    ambulance: "192",
    police: "199",
    touristPolice: null,
    highway: null,
    messenger: "messenger",
  },
  {
    code: "LK",
    name: "Sri Lanka",
    flag: "🇱🇰",
    language: "si",
    ambulance: "1990",
    police: "118",
    touristPolice: "1912",
    highway: "1938",
    messenger: "whatsapp",
  },
  {
    code: "NP",
    name: "Nepal",
    flag: "🇳🇵",
    language: "ne",
    ambulance: "102",
    police: "100",
    touristPolice: "1144",
    highway: "103",
    messenger: "whatsapp",
  },
  {
    code: "BD",
    name: "Bangladesh",
    flag: "🇧🇩",
    language: "bn",
    ambulance: "199",
    police: "999",
    touristPolice: null,
    highway: null,
    messenger: "whatsapp",
  },
  {
    code: "BT",
    name: "Bhutan",
    flag: "🇧🇹",
    language: "dz",
    ambulance: "112",
    police: "110",
    touristPolice: null,
    highway: "113",
    messenger: "whatsapp",
  },
];

export const getCountry = (code: string): Country => {
  const normalized = code.trim().toUpperCase();
  return (
    BIMSTEC_COUNTRIES.find((country) => country.code === normalized) ??
    BIMSTEC_COUNTRIES[0]
  );
};
