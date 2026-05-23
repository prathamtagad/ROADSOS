export const EMERGENCY_NUMBERS = {
  TH: {
    ambulance: "1669",
    police: "191",
    fire: "199",
    touristPolice: "1155",
    highway: "1193"
  },
  MM: {
    ambulance: "192",
    police: "199",
    fire: "191",
    touristPolice: null,
    highway: null
  },
  LK: {
    ambulance: "1990",
    police: "118",
    fire: "110",
    touristPolice: "1912",
    highway: "1938"
  },
  NP: {
    ambulance: "102",
    police: "100",
    fire: "101",
    touristPolice: "1144",
    highway: "103"
  },
  BD: {
    ambulance: "199",
    police: "999",
    fire: "199",
    touristPolice: null,
    highway: null
  },
  BT: {
    ambulance: "112",
    police: "110",
    fire: "110",
    touristPolice: null,
    highway: "113"
  }
};

export const NATIONAL_TOWING_HOTLINES = {
  TH: { number: "1193", authority: "Department of Highways" },
  MM: { number: "195", authority: "Fire and Emergency" },
  LK: { number: "1938", authority: "Road Development Authority" },
  NP: { number: "103", authority: "Traffic Police" },
  BD: { number: "999", authority: "General Emergency" },
  BT: { number: "113", authority: "Police" }
};

export const ROAD_ASSIST_HOTLINES = {
  TH: { service: "AOW Thai Roadside Assistance", phone: "1800-200-789" },
  LK: { service: "Sri Lanka Automobile Association", phone: "+94-11-242-1528" },
  NP: { service: "Nepal Automobile Association", phone: "+977-1-443-9958" },
  BD: { service: "BRTC Emergency", phone: "16374" },
  MM: { service: "Myanmar Roads and Bridges Dept", phone: "+95-67-404-061" },
  BT: { service: "Department of Roads", phone: "+975-2-323-251" }
};

export const COUNTRY_MESSENGER_MAP = {
  TH: "line",
  MM: "messenger",
  LK: "whatsapp",
  NP: "whatsapp",
  BD: "whatsapp",
  BT: "whatsapp"
};

export const COUNTRY_NAME_MAP = {
  TH: "Thailand",
  MM: "Myanmar",
  LK: "Sri Lanka",
  NP: "Nepal",
  BD: "Bangladesh",
  BT: "Bhutan"
};


export const ROAD_ASSIST_MOCK_CONTACTS = {
  TH: {
    towing: [
      {
        id: "th-tow-001",
        name: "Bangkok Rapid Tow",
        phone: "+66 2 011 2400",
        category: "towing",
        country: "TH",
        address: "Rama IV Rd, Bangkok",
        rating: 4.7,
        brand: "BKK Rapid",
        lastVerified: "2026-04-28T09:30:00.000Z",
        isVerified: true
      },
      {
        id: "th-tow-002",
        name: "Sukhumvit Towline",
        phone: "+66 2 842 7740",
        category: "towing",
        country: "TH",
        address: "Sukhumvit 55, Bangkok",
        rating: 4.4,
        brand: "Towline",
        lastVerified: "2026-04-20T08:10:00.000Z",
        isVerified: false
      },
      {
        id: "th-tow-003",
        name: "Highway Lift & Go",
        phone: "+66 2 305 9881",
        category: "towing",
        country: "TH",
        address: "Vibhavadi Rd, Bangkok",
        rating: 4.1,
        brand: "Lift & Go",
        lastVerified: "2026-03-18T14:42:00.000Z",
        isVerified: false
      }
    ],
    tyres: [
      {
        id: "th-tyre-001",
        name: "Phaya Thai Tyre Hub",
        phone: "+66 2 215 3321",
        category: "tyres",
        country: "TH",
        address: "Phaya Thai Rd, Bangkok",
        rating: 4.8,
        brand: "Tyre Hub",
        lastVerified: "2026-04-15T10:05:00.000Z",
        isVerified: true
      },
      {
        id: "th-tyre-002",
        name: "Rama 9 Quick Tyres",
        phone: "+66 2 119 5400",
        category: "tyres",
        country: "TH",
        address: "Rama 9 Rd, Bangkok",
        rating: 4.3,
        brand: "Quick Tyres",
        lastVerified: "2026-04-02T12:00:00.000Z",
        isVerified: false
      },
      {
        id: "th-tyre-003",
        name: "Don Mueang Auto Care",
        phone: "+66 2 533 7061",
        category: "tyres",
        country: "TH",
        address: "Chaeng Watthana Rd, Bangkok",
        rating: 4.2,
        brand: "Auto Care",
        lastVerified: "2026-03-09T07:30:00.000Z",
        isVerified: false
      }
    ],
    showroom: [
      {
        id: "th-show-001",
        name: "BIMSTEC Mobility Center",
        phone: "+66 2 673 2200",
        category: "showroom",
        country: "TH",
        address: "Sathon Rd, Bangkok",
        rating: 4.6,
        brand: "BIMSTEC",
        lastVerified: "2026-04-10T15:30:00.000Z",
        isVerified: true
      },
      {
        id: "th-show-002",
        name: "Ratchada Auto Plaza",
        phone: "+66 2 692 7780",
        category: "showroom",
        country: "TH",
        address: "Ratchadaphisek Rd, Bangkok",
        rating: 4.1,
        brand: "Auto Plaza",
        lastVerified: "2026-03-22T09:45:00.000Z",
        isVerified: false
      },
      {
        id: "th-show-003",
        name: "Bang Na Service Lounge",
        phone: "+66 2 749 1180",
        category: "showroom",
        country: "TH",
        address: "Bang Na-Trat Rd, Bangkok",
        rating: 4.3,
        brand: "Service Lounge",
        lastVerified: "2026-03-01T11:20:00.000Z",
        isVerified: false
      }
    ]
  },
  LK: {
    towing: [
      {
        id: "lk-tow-001",
        name: "Colombo Tow Assist",
        phone: "+94 11 230 8222",
        category: "towing",
        country: "LK",
        address: "Galle Rd, Colombo",
        rating: 4.5,
        brand: "Tow Assist",
        lastVerified: "2026-04-12T08:00:00.000Z",
        isVerified: true
      }
    ],
    tyres: [
      {
        id: "lk-tyre-001",
        name: "Kandy Tyre Works",
        phone: "+94 81 222 1100",
        category: "tyres",
        country: "LK",
        address: "Peradeniya Rd, Kandy",
        rating: 4.4,
        brand: "Tyre Works",
        lastVerified: "2026-03-30T10:10:00.000Z",
        isVerified: false
      }
    ],
    showroom: [
      {
        id: "lk-show-001",
        name: "Colombo Auto Gallery",
        phone: "+94 11 555 9001",
        category: "showroom",
        country: "LK",
        address: "Union Pl, Colombo",
        rating: 4.2,
        brand: "Auto Gallery",
        lastVerified: "2026-03-21T13:00:00.000Z",
        isVerified: false
      }
    ]
  },
  NP: {
    towing: [
      {
        id: "np-tow-001",
        name: "Kathmandu Towline",
        phone: "+977 1 446 8111",
        category: "towing",
        country: "NP",
        address: "Ring Rd, Kathmandu",
        rating: 4.3,
        brand: "Towline",
        lastVerified: "2026-04-01T09:20:00.000Z",
        isVerified: false
      }
    ],
    tyres: [
      {
        id: "np-tyre-001",
        name: "Lalitpur Tyre Center",
        phone: "+977 1 553 2201",
        category: "tyres",
        country: "NP",
        address: "Jawalakhel, Lalitpur",
        rating: 4.1,
        brand: "Tyre Center",
        lastVerified: "2026-03-18T07:40:00.000Z",
        isVerified: false
      }
    ],
    showroom: [
      {
        id: "np-show-001",
        name: "Bagmati Auto House",
        phone: "+977 1 447 5500",
        category: "showroom",
        country: "NP",
        address: "New Baneshwor, Kathmandu",
        rating: 4.2,
        brand: "Auto House",
        lastVerified: "2026-03-11T15:00:00.000Z",
        isVerified: false
      }
    ]
  }
};
