# ROADSOS — Product Requirements Document
### AI-Powered Cross-Border Emergency Response & Road Assistance System
**Road Safety Hackathon 2026 | Version 4.0 — Evaluation-Aligned Edition**
*Bangladesh · Myanmar · Sri Lanka · Thailand · Nepal · Bhutan*

---

## Evaluation Criteria Alignment (Quick Reference)

| Official Criterion | ROADSOS Coverage | Section |
|---|---|---|
| Nearest police stations, hospitals, ambulance | ✅ Hospital ranking AI, trauma center detection, police auto-dial, all 6 country numbers | §6.2, §7 |
| Towing services, puncture shops, showrooms | ✅ Road Assist Mode — dedicated feature | **§6.11** |
| Global applicability across countries | ✅ Country-agnostic architecture, BIMSTEC-first, extensible to any country | §5, §14 |
| Offline functionality in low-network | ✅ P0 feature — full offline stack, SMS fallback, cached contacts | §6.10 |
| Reliability and data accuracy | ✅ Multi-source verification, freshness timestamps, user correction system | **§9.5** |
| Number of contacts fetched | ✅ 8 contact categories across 6 countries — maximised | **§6.11, §7** |
| Offline functionality | ✅ P0 — repeated emphasis throughout | §6.10 |
| Innovation & additional features | ✅ Border Mode, Mountain Mode, Tourist Card, Hazard Mesh, BEDS protocol | §6.1–6.9 |
| Information integration across countries | ✅ BIMSTEC Smart Border Mode + BEDS open standard | §6.1, §14 |

---

## Table of Contents

1. Executive Summary
2. The BIMSTEC Road Safety Crisis
3. Problem Statement
4. Target Users
5. Core Value Proposition
6. Feature Specifications
   - 6.1 BIMSTEC Smart Border Mode
   - 6.2 Auto Emergency Trigger
   - 6.3 Country-Intelligent Messenger Layer
   - 6.4 Tourist Emergency Card
   - 6.5 Motorcycle First Mode
   - 6.6 Mountain Rescue Mode
   - 6.7 AI First Aid Guidance
   - 6.8 Community Hazard Mesh
   - 6.9 Cross-Border Migrant Worker Mode
   - 6.10 Offline Mode
   - **6.11 Road Assist Mode** ← new
7. Country Intelligence Layer — All Contact Types
8. User Flows
9. Technical Architecture
   - 9.1 Stack Overview
   - 9.2 Firestore Schema
   - 9.3 Realtime Database Schema
   - 9.4 Cloud Functions
   - **9.5 Data Reliability & Accuracy System** ← new
   - 9.6 Maps & Offline Strategy
   - 9.7 AI Layer
   - 9.8 Free Tier Limits
10. Competition Demo Script
11. Success Metrics & KPIs
12. Risks & Mitigations
13. Go-to-Market Strategy
14. The Open Protocol Proposal (BEDS)
15. Appendix

---

## 1. Executive Summary

Five of the six BIMSTEC countries (excluding India) rank among the most dangerous road environments in Asia. Together they record over **50,000 road deaths annually**, with millions more left stranded every year by breakdowns, punctures, and post-accident vehicle damage — events that are rarely fatal but are deeply disruptive and often dangerous when they occur on highways at night.

**ROADSOS** is an AI-powered emergency response and road assistance platform built specifically for the BIMSTEC region's realities: motorcycle-dominated roads, mountain terrain, cross-border movement, multiple messenger ecosystems, and connectivity gaps. It fetches contacts across **8 categories** — hospitals, ambulances, police, towing services, tyre repair shops, vehicle showrooms, embassies, and road assistance hotlines — all cached offline, all country-aware, all updated automatically.

It is the first emergency system that is **country-aware** — automatically switching emergency contacts, databases, language, and communication channels the moment a user crosses a border.

Built entirely on **free-tier services** — Firebase, Google AI Studio, Google Maps Platform, and open APIs — ROADSOS runs at zero cost during the hackathon and pilot phase.

**UN SDG Alignment:**
SDG 3.6 (road safety) · SDG 11.2 (safe transport) · SDG 17 (regional partnerships)

---

## 2. The BIMSTEC Road Safety Crisis

| Country | Deaths / 100K | Primary Risk | Dominant Messenger |
|---|---|---|---|
| 🇹🇭 Thailand | **30.48** *(highest in Asia)* | Motorcycles — 80% of deaths | LINE |
| 🇲🇲 Myanmar | 20.94 | Pedestrians + Motorcycles | Facebook Messenger |
| 🇧🇹 Bhutan | 17.35 | Mountain roads | WhatsApp |
| 🇱🇰 Sri Lanka | 18.07 | Coastal highways | WhatsApp |
| 🇳🇵 Nepal | ~20.00 *(rising)* | Mountain roads, 2-wheelers | WhatsApp / Viber |
| 🇧🇩 Bangladesh | 16.74 | Pedestrians, flooding | WhatsApp / Messenger |

**Key facts:**
- Thailand: 17,447 road deaths in 2024 — 3 people die in motorcycle accidents every 2 hours
- Nepal: 7 people die every day on Nepal's roads — rate is rising year on year
- Beyond fatalities: millions of annual breakdown incidents leave drivers stranded with no access to towing, repair, or assistance contacts — especially in low-connectivity rural areas

---

## 3. Problem Statement

When someone has an accident or breakdown in a BIMSTEC country, they face a cascade of failures:

**Emergency scenario:** The ambulance number they know is wrong for the country they're in. The hospital Google Maps finds isn't a trauma centre. The bystander uses Messenger, not WhatsApp. The family gets no automatic update.

**Breakdown scenario:** A flat tyre on a Thai highway at midnight. No idea what the towing number is. No way to search "nearest puncture shop" with zero signal. No contact for the vehicle showroom / service centre in the next town.

**Cross-border scenario:** A Nepali truck driver in Bangladesh has a breakdown. His phone has Nepal's contacts cached. Bangladesh towing companies, tyre shops, and the local police number are nowhere on his phone.

**Why existing tools fail every scenario:**
- Google Maps requires internet, doesn't surface towing or tyre shops reliably, has no emergency trigger
- Local emergency lines are language-restricted and can't share location automatically
- No app combines emergency + breakdown + cross-border + offline in one place

---

## 4. Target Users

| Persona | Key Need |
|---|---|
| Motorcycle rider (daily commuter) | Crash detection, hands-free trigger, rider medical profile |
| International tourist | Tourist Emergency Card, local contact numbers, embassy auto-dial |
| Cross-border migrant worker | Home country contacts, native language AI, embassy in current country |
| Mountain road traveller (Nepal/Bhutan) | Offline LZ finder, altitude first aid, satellite SOS fallback |
| Driver with breakdown (not emergency) | Towing contacts, nearest tyre shop, vehicle service centre |
| Bystander / Good Samaritan | Zero-install messenger bot access to all contact types |
| Hospital receiving staff | Advance FCM alert with patient ETA and medical profile |

---

## 5. Core Value Proposition

> *"ROADSOS fetches more contacts than any other road safety app in the region — across 8 categories, 6 countries, and 7 languages — and delivers them offline, in the right language, the moment you need them."*

**Global architecture, BIMSTEC first.** Every system — the contact database, the geofencing engine, the messenger routing, the offline cache — is built to be country-agnostic. Adding a new country requires: a new row in the emergency numbers table, a new hospital data source, and a new geofence polygon. The architecture supports every country in the world; BIMSTEC is the launch region.

| Capability | Google Maps | Generic SOS | Local Line | **ROADSOS** |
|---|---|---|---|---|
| Hospitals + ambulance | ✅ | ✅ | ✅ | ✅ |
| Police contacts | ✅ | Partial | ✅ | ✅ |
| Towing services | Partial | ❌ | ❌ | **✅** |
| Tyre / puncture shops | Partial | ❌ | ❌ | **✅** |
| Vehicle showrooms | Partial | ❌ | ❌ | **✅** |
| Embassy contacts | ❌ | ❌ | ❌ | **✅** |
| Insurance hotlines | ❌ | ❌ | ❌ | **✅** |
| Road assistance hotlines | ❌ | ❌ | ❌ | **✅** |
| Cross-border awareness | ❌ | ❌ | ❌ | **✅** |
| Multi-messenger routing | ❌ | ❌ | ❌ | **✅** |
| Motorcycle crash detection | ❌ | ❌ | ❌ | **✅** |
| Mountain rescue mode | ❌ | ❌ | ❌ | **✅** |
| Full offline (all categories) | ❌ | Partial | ❌ | **✅** |
| Verified data + freshness stamps | ❌ | ❌ | ❌ | **✅** |

---

## 6. Feature Specifications

---

### 6.1 🌏 BIMSTEC SMART BORDER MODE
**Priority: P0 — Core Differentiator**

When a user's GPS crosses a country boundary, ROADSOS silently reconfigures every contact category automatically. No user action required.

**What auto-switches on border crossing:**

| Category | Thailand → Myanmar example |
|---|---|
| Ambulance | 1669 → 192 |
| Police | 191 → 199 |
| Tourist Police | 1155 → — |
| Towing hotline | Thai highway towing → Myanmar road assistance |
| Hospital database | Thai hospitals → Myanmar hospitals |
| Tyre shop database | Thai shops → Myanmar shops |
| Primary messenger | LINE → Facebook Messenger |
| First aid language | Thai → Burmese |
| Embassy contacts | Updates for tourist's nationality in new country |

**Implementation:**
- Border geofences stored as GeoJSON in Firestore, synced to device at app start
- On-device detection via Turf.js — fires even without internet once cached
- 5km buffer zone at major crossings — reconfigures before the user fully crosses
- User gets a silent notification: *"You've entered Myanmar. All contacts updated."*

---

### 6.2 🚨 AUTO EMERGENCY TRIGGER
**Priority: P0**

| Method | Who | How |
|---|---|---|
| Crash Detection (auto) | All vehicles | Accelerometer > 3G + gyroscope tip-over signature |
| Helmet Tap (3x) | Motorcycle riders | Rapid tap on phone in tank bag / pocket |
| SOS Button | Conscious users | Large single-tap button on home screen |
| Voice Command | Hands-free riders | "ROADSOS help" — always-listening, opt-in |
| Messenger Keyword | Bystanders, no app | "ACCIDENT" → LINE / Messenger / WhatsApp bot |
| Breakdown Button | Stranded driver | Separate large button → triggers Road Assist Mode |

**Post-trigger flow:**
1. 10-second countdown — large CANCEL button visible
2. Cancel requires PIN — prevents panic cancels
3. If not cancelled → Emergency Mode or Road Assist Mode activates
4. Firestore write to `incidents/{id}` → Cloud Functions fire in parallel

---

### 6.3 📲 COUNTRY-INTELLIGENT MESSENGER LAYER
**Priority: P0**

| Country | Primary Bot | Secondary |
|---|---|---|
| 🇹🇭 Thailand | LINE Official Account | WhatsApp |
| 🇲🇲 Myanmar | Facebook Messenger | WhatsApp |
| 🇱🇰 Sri Lanka | WhatsApp | Messenger |
| 🇳🇵 Nepal | WhatsApp | Viber |
| 🇧🇩 Bangladesh | WhatsApp | Messenger |
| 🇧🇹 Bhutan | WhatsApp | — |

All bots share one Firebase Cloud Function handler. A `platform` parameter routes to the correct API. Bystanders can access **all 8 contact categories** through the bot — not just hospitals.

**Bystander bot — expanded contact access (example):**
```
User sends: "puncture shop near me" → shares location
Bot replies:
  🔧 Nearest tyre repair shops:
  1. Big Tyres Chiang Mai — 1.2km — ☎ +66-53-XXX-XXX — Open now
  2. Thai Tyre Service — 2.8km — ☎ +66-53-XXX-XXX — Open now
  📍 Maps link: [Google Maps directions]

User sends: "towing" → shares location
Bot replies:
  🚛 Nearest towing services:
  1. Highway Assist Thailand — ☎ 1193 (Highway Dept)
  2. [Nearest private towing] — ☎ +66-XX-XXX-XXXX — 15 min ETA
```

---

### 6.4 🆘 TOURIST EMERGENCY CARD
**Priority: P0**

Auto-displayed on lock screen when SOS triggers. No unlock required. Bilingual: English + current country language.

```
╔══════════════════════════════════════════╗
║  🆘  EMERGENCY — ฉุกเฉิน                 ║
╠══════════════════════════════════════════╣
║  Name: Sarah Mitchell  Blood Type: A+    ║
║  Allergies: Penicillin, NSAIDs           ║
║  Conditions: Asthmatic                   ║
╠══════════════════════════════════════════╣
║  Emergency Contact:                      ║
║  James Mitchell +44-7700-900123 (UK)     ║
╠══════════════════════════════════════════╣
║  Insurance: AXA Travel — #AX92831        ║
║  Claim Line: +44-1234-567890             ║
╠══════════════════════════════════════════╣
║  UK Embassy (Thailand): +66-2-305-8333   ║
╚══════════════════════════════════════════╝
```

Embassy contact auto-updates when user crosses into a new country.

---

### 6.5 🏍️ MOTORCYCLE FIRST MODE
**Priority: P0**

The core UX philosophy given 80%+ of BIMSTEC road deaths involve motorcycles.

- Separate TFLite crash model tuned for two-wheeler tip-over signatures
- Helmet tap trigger: 3 taps = SOS
- Voice-only UI above 30 km/h
- Rider profile stored in Firestore: helmet type, gear, blood type, bike registration
- If phone stationary for 15 seconds post-crash detection → auto-escalates (rider incapacitated)

---

### 6.6 🏔️ MOUNTAIN RESCUE MODE
**Priority: P0 for Nepal and Bhutan**

Auto-activates when altitude > 1,500m (GPS + SRTM elevation data).

- **Helicopter LZ Finder:** Analyses cached SRTM tiles for flat terrain ≥ 20m × 20m within 3km. Outputs GPS coordinates formatted for rescue coordination. Fully offline.
- **Altitude-adjusted first aid:** Gemini API receives altitude as context — hypothermia priority, adjusted CPR depth, tourniquet monitoring intervals
- **Last known location beacon:** GPS written to Firestore every 10 minutes even with weak signal
- **Extended offline cache:** 200km hospital radius (vs 50km standard), full mountain corridor map tiles

> Satellite SOS (Garmin inReach) requires hardware + paid subscription. Planned as Phase 2 partnership. Demo shows "Offline SOS Active" fallback screen.

---

### 6.7 🧑‍⚕️ AI FIRST AID GUIDANCE
**Priority: P1**

Powered by Gemini API (Google AI Studio free tier). WHO Trauma Care protocol validated.

- Short numbered steps — readable under extreme stress
- Icon-based steps — no reading required for core actions
- Audio narration — speaker mode, hands-free
- Altitude-context aware (see Mountain Mode)
- BIMSTEC-specific: flooding guidance (Bangladesh/Myanmar), heat + trauma (Thailand)
- All 7 languages: Thai · Burmese · Sinhala · Nepali · Dzongkha · Bengali · English

---

### 6.8 🌍 COMMUNITY HAZARD MESH
**Priority: P1**

Anonymous hazard reporting with Firestore-backed verification.

| Hazard | Countries |
|---|---|
| Road flooding / submerged sections | Bangladesh, Myanmar |
| Landslide / rockfall | Nepal, Bhutan |
| Unmarked construction | All |
| Animals on road (elephants, yaks) | Thailand, Myanmar, Bhutan |
| Dangerous potholes | All |
| Mountain pass fog / zero visibility | Nepal, Bhutan |

3+ reports within 500m / 30 minutes → `verified: true`. Overlaid on route map. Cloud Scheduler expires stale hazards automatically.

---

### 6.9 🔗 CROSS-BORDER MIGRANT WORKER MODE
**Priority: P1**

For the estimated 3+ million Nepali, Bangladeshi, and Myanmar workers across BIMSTEC countries.

- Home country contacts stored separately from local contacts
- Work permit / visa number for police report auto-fill
- Embassy of home country in current country pre-loaded from Firestore
- First aid guidance rendered in worker's native language regardless of current country
- On emergency trigger: home country family notified simultaneously with local contacts

---

### 6.10 🌐 OFFLINE MODE
**Priority: P0 — Explicitly Scored Criterion**

**All 8 contact categories are pre-cached offline.** Not just hospitals — towing, tyre shops, showrooms, police, ambulance, embassies, insurance hotlines. All available with zero internet.

**Pre-cached on device:**
- Emergency numbers — all 6 BIMSTEC countries
- All 8 contact categories — nearest 50 entries per category, per country
- All first aid content — text, audio, icons — 7 languages
- OpenStreetMap tile cache — 50km radius standard, 200km mountain mode
- SRTM elevation tiles — Nepal and Bhutan highland corridors
- Country border GeoJSON for Turf.js geofencing
- SMS templates for all alert types

**Freshness shown to user:** Every cached contact displays: *"Last synced: 2 days ago"* — users always know the age of the data they're working with offline.

**Offline trigger flow:**
1. No internet → Offline Mode banner: *"Showing saved contacts — last synced 2 days ago"*
2. SOS trigger → cached hospitals + ambulance number used
3. Breakdown trigger → cached towing + tyre shops shown
4. SMS dispatched to emergency contacts with GPS coordinates
5. Local ambulance number auto-dialled

**Sync strategy:**
- Full refresh: weekly, WiFi only, background
- Hospital + emergency contact data: 3-day TTL
- Towing / tyre / showroom data: 7-day TTL (changes less frequently)
- Hazard mesh: syncs on any connection
- Freshness timestamp updated on every successful sync

---

### 6.11 🚛 ROAD ASSIST MODE
**Priority: P0 — Directly Addresses Scored Criterion**

Handles non-life-threatening breakdowns and post-accident vehicle recovery — the scenario where you're stranded but not injured. Activated by:
- Dedicated "Breakdown" button on home screen (conscious, mobile user)
- Manual selection after a false-alarm SOS cancel

**Contact categories fetched and displayed:**

#### A. Towing Services
- National highway towing hotlines (government, free)
- Nearest private towing companies (Google Places API: `type=towing_service`)
- Displayed with: name, phone, estimated arrival, distance, operating hours
- Offline: nearest 20 towing contacts per country cached

**Towing hotlines pre-loaded:**

| Country | National Towing / Highway Hotline |
|---|---|
| 🇹🇭 Thailand | 1193 (Department of Highways) |
| 🇲🇲 Myanmar | 195 (Fire + Emergency) |
| 🇱🇰 Sri Lanka | 1938 (Road Development Authority) |
| 🇳🇵 Nepal | 103 (Traffic Police) |
| 🇧🇩 Bangladesh | 999 (general emergency) |
| 🇧🇹 Bhutan | 113 (Police) |

#### B. Tyre Repair / Puncture Shops
- Fetched from Google Places API (`query: tyre repair shop`) + OpenStreetMap tag `shop=tyres`
- Filtered by: currently open, within 15km, rated ≥ 3.5 stars
- Sorted by: distance, then rating
- Displayed with: name, address, phone, distance, open/closed status, Google Maps link
- Offline: nearest 30 tyre shops per major highway corridor cached

#### C. Vehicle Showrooms & Authorised Service Centres
- User sets vehicle brand in profile (Toyota, Honda, Yamaha, etc.)
- Fetched from Google Places API filtered by brand name + `type=car_dealer`
- For motorcycles: nearest motorcycle dealerships
- Useful post-accident for: damage assessment, insurance inspection, spare parts
- Offline: nearest 10 authorised centres per brand per country cached

#### D. Road Assistance Hotlines
Pre-loaded government and private road assistance contacts per country:

| Country | Road Assistance |
|---|---|
| 🇹🇭 Thailand | AOW (Thai roadside assistance) 1800-200-789, RACQ partnerships |
| 🇱🇰 Sri Lanka | Sri Lanka Automobile Association: +94-11-242-1528 |
| 🇳🇵 Nepal | Nepal Automobile Association: +977-1-443-9958 |
| 🇧🇩 Bangladesh | BRTC Emergency: 16374 |
| 🇲🇲 Myanmar | Myanmar Roads and Bridges Dept: +95-67-404-061 |
| 🇧🇹 Bhutan | Department of Roads: +975-2-323-251 |

**Road Assist UI Flow:**
```
User taps "Breakdown" button
      ↓
ROADSOS detects current GPS + country
      ↓
Parallel Firestore queries:
  ├── Towing services (nearest 5, sorted by distance)
  ├── Tyre shops (nearest 5, open now)
  └── Showrooms (nearest 3, user's brand)
      ↓
Results displayed in tabbed card layout:
  [🚛 Towing] [🔧 Tyres] [🏢 Showroom] [📞 Hotlines]
      ↓
User taps any contact → one-tap call
      ↓
Incident logged to Firestore (breakdown type, location, contacts used)
```

**Integration with Emergency Mode:**
After an accident that is not life-threatening (user cancels SOS within 10 seconds), ROADSOS asks: *"Are you injured? → Get medical help | Are you okay but vehicle damaged? → Get road assistance"*. This routes to Road Assist Mode automatically.

---

## 7. Country Intelligence Layer — All Contact Types

### 7.1 Emergency Numbers (Pre-loaded Offline)

| Country | Ambulance | Police | Fire | Tourist Police | Highway |
|---|---|---|---|---|---|
| 🇹🇭 Thailand | 1669 | 191 | 199 | **1155** | 1193 |
| 🇲🇲 Myanmar | 192 | 199 | 191 | — | — |
| 🇱🇰 Sri Lanka | 1990 | 118 | 110 | 1912 | 1938 |
| 🇳🇵 Nepal | 102 | 100 | 101 | 1144 | 103 |
| 🇧🇩 Bangladesh | 199 | 999 | 199 | — | — |
| 🇧🇹 Bhutan | 112 | 110 | 110 | — | 113 |

### 7.2 Complete Contact Categories Fetched Per Country

| # | Category | Source | Offline Cached |
|---|---|---|---|
| 1 | Hospitals / Trauma Centres | Government health APIs + Google Places | ✅ 100 per country |
| 2 | Ambulance services | Pre-loaded + government API | ✅ All numbers |
| 3 | Police stations | Government open data + Google Places | ✅ 50 per country |
| 4 | Towing services | Google Places + highway hotlines | ✅ 20 per country |
| 5 | Tyre / puncture repair shops | Google Places + OSM `shop=tyres` | ✅ 30 per highway |
| 6 | Vehicle showrooms / service centres | Google Places filtered by brand | ✅ 10 per brand |
| 7 | Embassies (by user nationality) | Government embassy directories | ✅ All BIMSTEC pairs |
| 8 | Travel insurance / road assistance hotlines | Pre-loaded per country | ✅ All hotlines |

**Total contact types: 8 categories across 6 countries**
Each contact stored in Firestore with: name, phone, GPS, country, category, last verified timestamp, source URL, and user correction flag.

### 7.3 Hospital Data Sources (All Free)

| Country | Primary | Fallback |
|---|---|---|
| Thailand | NHSO Open Data API | Google Places |
| Myanmar | MOH Myanmar Hospital Directory | OpenStreetMap health layer |
| Sri Lanka | Ministry of Health facility list | Google Places |
| Nepal | Department of Health Services registry | Google Places |
| Bangladesh | DGHS Bangladesh facility database | Google Places |
| Bhutan | MoH Bhutan health facility list | Google Places |

---

## 8. User Flows

### Flow A — Emergency (Thailand → Myanmar cross-border rider)

```
Rider crosses into Myanmar → Turf.js geofence fires → all contacts auto-update
      ↓
Crash detected (motorcycle TFLite model)
      ↓
10-second countdown → not cancelled
      ↓
Firestore write → Cloud Functions fire in parallel:
  ├── Facebook Messenger alert to contacts (Thai + Burmese)
  ├── Auto-dial 192 (Myanmar ambulance)
  ├── FCM pre-alert to 3 nearest Myanmar hospitals
  └── Live GPS written to Realtime DB every 15 seconds
      ↓
Bystander: Messenger → "ACCIDENT" → bot replies in Burmese with hospital + first aid
Family: LINE message (Thai) with hospital name, map link, ETA
Tourist Emergency Card: visible on lock screen
```

### Flow B — Breakdown (Stranded driver, Bangkok highway)

```
Driver taps "Breakdown" button
      ↓
GPS captured → country confirmed (Thailand)
      ↓
Parallel Firestore queries + Google Places API:
  ├── 5 nearest towing services (sorted by distance)
  ├── 5 nearest tyre shops (open now, rated ≥ 3.5)
  └── 3 nearest Toyota service centres (user's brand)
      ↓
Results shown in tabbed card layout
Driver taps "Call" → one-tap dial
      ↓
Incident logged: breakdown, location, towing contacted
      ↓
If signal lost mid-flow → cached contacts shown instantly
  Banner: "Showing saved contacts — last synced 1 day ago"
```

### Flow C — Mountain Emergency (Nepal, offline)

```
Altitude > 1,500m → Mountain Mode activates
Crash → SOS → zero cell signal detected → Offline Mode
      ↓
Cached Nepal hospitals shown (200km radius)
Helicopter LZ Finder: SRTM analysis → flat terrain 180m north
Altitude-adjusted first aid: hypothermia PRIMARY
      ↓
SMS to emergency contacts with last GPS
102 auto-dialled
      ↓
When signal returns → Firestore write → full parallel alert fires
```

### Flow D — Tourist Bystander (no app, Thailand)

```
Opens LINE → ROADSOS → types "ACCIDENT"
      ↓
Bot replies in Thai < 5 seconds:
  1669 alerted · Nearest trauma centre: 1.8km · First aid steps
  Tourist Police 1155 notified
      ↓
Types "towing" → bot shows 3 nearest towing contacts + 1193 hotline
Types "tyre shop" → bot shows 2 nearest open shops with phone + distance
```

---

## 9. Technical Architecture

### 9.1 Stack Overview — Entirely Free Tier

```
┌──────────────────────────────────────────────────────────┐
│                     MOBILE APP                           │
│  React Native + Expo (iOS + Android, single codebase)    │
│  Zustand — state · expo-sqlite — local cache             │
│  react-native-maps — Google Maps ($200 free credit)      │
│  TFLite — on-device crash detection (offline, free)      │
│  Turf.js — on-device geofencing (offline, free)          │
│  expo-task-manager — background accelerometer polling    │
└──────────────────┬───────────────────────────────────────┘
                   │ Firebase SDK (all free tier)
┌──────────────────▼───────────────────────────────────────┐
│                     FIREBASE                             │
│  Auth          — user authentication (unlimited free)    │
│  Firestore     — all contact databases + incidents       │
│  Realtime DB   — live ETA + location tracking            │
│  Cloud Fns     — API logic, alert dispatch, bot handler  │
│  Cloud Msg     — push notifications / FCM (free)         │
│  Hosting       — hospital web dashboard                  │
│  Cloud Sched   — weekly data refresh + TTL expiry        │
└──────────┬───────────────────────────┬───────────────────┘
           │                           │
┌──────────▼──────────┐   ┌────────────▼──────────────────┐
│  GOOGLE AI STUDIO   │   │  MESSENGER BOTS               │
│  Gemini API (free)  │   │  LINE Messaging API (free)    │
│  1,500 req/day      │   │  Meta Messenger API (free)    │
│  15 RPM             │   │  WhatsApp Cloud API           │
│  1M tokens/min      │   │  (1,000 conv/month free)      │
└─────────────────────┘   └───────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              ON-DEVICE OFFLINE CACHE                     │
│  OSM tile cache         — offline map rendering (free)   │
│  SRTM elevation tiles   — Mountain Mode LZ finder (free) │
│  All 8 contact cats     — 3–7 day TTL, per country       │
│  First aid content      — text + audio, 7 languages      │
│  Country border GeoJSON — Turf.js geofencing             │
│  Emergency numbers      — all 6 BIMSTEC countries        │
└──────────────────────────────────────────────────────────┘
```

---

### 9.2 Firestore Database Schema

```
firestore/
│
├── users/{userId}
│   ├── name, bloodType, allergies, conditions
│   ├── emergencyContacts: [{name, phone, messenger, language}]
│   ├── homeCountry, currentCountry
│   ├── vehicleBrand (for showroom lookup)
│   ├── vehicleReg (for police report auto-fill)
│   ├── workPermitNumber (migrant worker mode)
│   ├── insurancePolicy, embassyNumbers
│   └── riderProfile: {helmetType, gear, bikeReg}
│
├── incidents/{incidentId}
│   ├── userId, timestamp, type: "emergency" | "breakdown"
│   ├── location: {lat, lng, altitude, country}
│   ├── triggerType: "crash" | "sos_button" | "breakdown" | "messenger"
│   ├── status: "active" | "resolved" | "false_alarm"
│   ├── assignedHospital: {name, phone, eta}
│   ├── roadAssist: {towingContacted, tyreShopContacted}
│   └── alertsSent: {family, hospital, ambulance, police}
│
├── contacts/{contactId}                   ← ALL 8 CATEGORIES
│   ├── category: "hospital" | "police" | "towing" | "tyre_shop"
│   │             | "showroom" | "embassy" | "insurance" | "road_assist"
│   ├── name, phone, country
│   ├── location: {lat, lng}
│   ├── address, operatingHours
│   ├── rating (Google Places rating, if available)
│   ├── brand (for showrooms — "Toyota", "Honda", etc.)
│   ├── lastVerified (timestamp)           ← DATA ACCURACY
│   ├── verificationSource: "government_api" | "google_places" | "osm"
│   ├── isVerified: bool
│   └── userCorrectionFlag: bool           ← USER CORRECTIONS
│
├── hazards/{hazardId}
│   ├── type, location: {lat, lng}, country
│   ├── reportCount, verified: bool
│   ├── reportedAt, expiresAt
│   └── reportedBy: [anonymized userId list]
│
├── dataQuality/{country}                  ← NEW: DATA TRACKING
│   ├── lastRefreshed: timestamp
│   ├── contactCounts: {hospital: N, towing: N, tyre: N, ...}
│   ├── verificationRate: 0.0–1.0
│   └── correctionsPending: N
│
└── borderGeofences/{countryPair}
    ├── fromCountry, toCountry
    ├── geojson: [polygon coordinates]
    └── crossingPoints: [{name, lat, lng}]
```

---

### 9.3 Realtime Database Schema

```
realtime-db/
└── liveTracking/{incidentId}
    ├── lat, lng, altitude
    ├── updatedAt (timestamp — written every 15 seconds)
    ├── ambulanceETA (minutes — updated by hospital function)
    └── status: "en_route" | "at_hospital" | "safe"
```

Auto-deleted 24 hours after incident resolved (Firebase TTL rules).

---

### 9.4 Cloud Functions — Parallel Alert Dispatch

A Firestore `onCreate` trigger on `incidents/` calls all alert sub-functions simultaneously:

```javascript
// functions/src/incidentDispatcher.js

exports.onIncidentCreated = functions.firestore
  .document('incidents/{incidentId}')
  .onCreate(async (snap, context) => {
    const incident = snap.data();

    if (incident.type === 'emergency') {
      await Promise.all([
        alertNearestHospitals(incident),    // FCM to hospital dashboard
        notifyEmergencyContacts(incident),  // LINE / Messenger / WhatsApp
        startLocationTracking(incident),    // Write to Realtime DB
        autoDialAmbulance(incident),        // Instruct app to dial local number
        sendFirstAidToDevice(incident),     // FCM push → opens first aid screen
      ]);
    }

    if (incident.type === 'breakdown') {
      await Promise.all([
        fetchTowingContacts(incident),      // Query Firestore contacts collection
        fetchTyreShops(incident),           // Query + Google Places fallback
        fetchShowrooms(incident),           // Query by user's vehicle brand
        logBreakdownForAnalytics(incident), // Anonymised data quality logging
      ]);
    }
  });
```

---

### 9.5 Data Reliability & Accuracy System

This section directly addresses the **"Reliability and data accuracy"** evaluation criterion.

#### Multi-Source Verification
Every contact in the `contacts` collection is cross-referenced before being committed:

```
Government API data ──┐
                      ├── Cloud Function compares both sources
Google Places data  ──┘
  │
  ├── Phone numbers match → isVerified: true, verificationSource: "cross_verified"
  ├── Only one source available → isVerified: true, verificationSource: "single_source"
  └── Numbers conflict → flagged for manual review, not shown to users until resolved
```

#### Freshness Timestamps — Shown to Users
Every contact displayed in the app shows its last verified date:
- ✅ Green: verified within 3 days
- 🟡 Amber: verified 4–7 days ago
- 🔴 Red: verified 8+ days ago — shown with warning: *"This contact may be outdated. Verify before use."*

This applies both online (live from Firestore) and offline (from local cache, with cache date shown).

#### Automated Refresh Pipeline

```
Cloud Scheduler (weekly, every Sunday 2AM UTC)
      ↓
refreshContactsFunction fires per country
      ↓
For each contact category:
  ├── Fetch from government API (if available)
  ├── Fetch from Google Places API
  ├── Cross-reference phone numbers
  ├── Update lastVerified timestamp
  └── Write updated contact to Firestore
      ↓
dataQuality/{country} document updated:
  lastRefreshed, contactCounts, verificationRate
```

#### User Correction System
Any user can flag a wrong contact in one tap:

```
User taps "Wrong number?" on any contact card
      ↓
Firestore write: contacts/{id}.userCorrectionFlag = true
      ↓
Cloud Function: if correctionFlags ≥ 3 on same contact
  → contact hidden from results
  → added to corrections queue for manual verification
  → admin notified via FCM to hospital dashboard
      ↓
After manual verification: contact updated or removed
```

#### Data Quality Dashboard (Firebase Hosting — Web)
A lightweight admin web dashboard shows:
- Total contacts per category per country
- Verification rate (% cross-verified vs single-source)
- Pending user corrections
- Last refresh timestamp per country
- Contacts flagged as potentially outdated (> 7 days)

---

### 9.6 Maps & Offline Strategy

**Online (Google Maps Platform — $200 free credit/month):**
- Routing and live traffic: Google Directions API
- Contact discovery: Google Places API (all 8 categories)
- Geocoding: Google Geocoding API
- Rendered via `react-native-maps` (Google Maps on Android — free)

**Offline (OpenStreetMap + SRTM — free):**
- Map tiles: `.mbtiles` files cached per country via `expo-file-system`
- Tyre shop data: OpenStreetMap `shop=tyres` + `shop=car_repair` tags (free download)
- Police stations: OpenStreetMap `amenity=police` tags
- Elevation: SRTM 90m resolution tiles for Nepal + Bhutan mountain zones

**Tile footprint targets:**
- Standard mode: 50km radius ≈ 80–120MB per country
- Mountain mode (Nepal/Bhutan corridors): ≈ 200MB additional
- Total offline footprint: < 500MB (acceptable for modern phones)

---

### 9.7 AI Layer — Gemini API (Google AI Studio Free)

**Use cases:**
- First aid guidance (language + altitude context)
- Hazard report classification from free-text input
- Messenger bot intent detection fallback
- Contact search from natural language: *"I need a Toyota service centre near me"*

**Free tier:** 1,500 req/day, 15 RPM — well within pilot usage. Scale path: Vertex AI when daily requests exceed free tier.

---

### 9.8 Free Tier Limits Summary

| Service | Free Limit | Expected Pilot Usage | Buffer |
|---|---|---|---|
| Firestore reads | 50,000 / day | ~8,000 / day | ✅ 6x |
| Firestore writes | 20,000 / day | ~3,000 / day | ✅ 6x |
| Cloud Functions | 2M / month | ~80K / month | ✅ 25x |
| FCM push | Unlimited | Unlimited | ✅ |
| Realtime DB | 1GB / 10GB transfer | < 100MB | ✅ |
| Gemini API | 1,500 req / day | ~300 req / day | ✅ 5x |
| Google Maps | $200 credit (~28K loads) | < 5,000 loads | ✅ |
| WhatsApp API | 1,000 conv / month | < 200 / month | ✅ 5x |
| LINE API | 200 push / month | < 50 / month | ✅ |
| **Total cost** | | | **$0 / month** |

---

## 10. Competition Demo Script

**4–5 minutes | Arc: Shock → Gap → Solution → Proof → Vision**

---

**Opening — The Numbers (30 sec)**
> *"Three people die in motorcycle accidents in Thailand every two hours. Seven people die on Nepal's roads every single day. Five of the six BIMSTEC countries in this room rank among the most dangerous road environments in all of Asia.*
>
> *And when someone has an accident or a breakdown on these roads — they pull out their phone, they search for a hospital, a towing service, a tyre shop — and they get a Google Maps result that doesn't work offline, doesn't know which country they're in, and has never been verified.*
>
> *ROADSOS fixes that."*

---

**Beat 1 — The Contact Gap (30 sec)**
> *"When a driver is stranded on a Thai highway at midnight, they need more than an ambulance number. They need towing. They need a tyre shop that's open. They need the highway assistance hotline. And they need all of this to work when they have no signal.*
>
> *ROADSOS fetches contacts across 8 categories — hospitals, police, ambulance, towing, tyre shops, vehicle showrooms, embassies, road assistance hotlines — for every country in the region. All cached offline. All verified."*

**[Show Road Assist Mode UI — tabs: Towing | Tyres | Showroom | Hotlines]**
**[Show "Last synced: 1 day ago" freshness indicator]**

---

**Beat 2 — Border Mode (30 sec)**
Show map. Drag pin from Thailand across Myanmar border. Watch app reconfigure:
- Ambulance: 1669 → 192
- Messenger: LINE → Facebook Messenger
- All contact categories reload for Myanmar

> *"Fully automatic. No user action. The moment you cross — ROADSOS crosses with you."*

---

**Beat 3 — The Emergency (45 sec)**
Shake phone. Countdown. Show parallel dispatch:
- Messenger alert to family (their language, their app)
- Hospital pre-alerted via FCM
- Tourist Emergency Card on lock screen

Bystander opens Facebook Messenger → types "ACCIDENT" → bot replies in Burmese in under 5 seconds with hospital, first aid, towing contacts.

> *"Everything — in under 10 seconds. No app download for the bystander. Just the messenger they already use."*

---

**Beat 4 — Mountain Mode (30 sec)**
Altitude climbs above 1,500m → Mountain Mode banner. Toggle airplane mode → Offline Mode. Show helicopter LZ finder output. Show altitude-adjusted first aid.

> *"Nearest hospital: 3 hours by road. ROADSOS finds the helicopter landing zone — offline, on a free dataset."*

---

**Beat 5 — Data You Can Trust (20 sec)**
Show the data quality dashboard (Firebase Hosting). Show contact counts per country per category. Show verification rate. Show last refresh timestamp.

> *"Every contact is cross-verified against two sources. Every contact shows the user exactly when it was last checked. And any user can flag a wrong number in one tap."*

---

**Close — The Open Standard (30 sec)**
> *"ROADSOS is not just an app. We're proposing an open data standard — a common JSON format so hospitals, governments, and emergency systems across all BIMSTEC countries can share contact data, incident data, and hazard data in real time.*
>
> *Not just one product. Regional infrastructure.*
>
> *ROADSOS. Every second counts. Every contact too."*

---

## 11. Success Metrics & KPIs

### Technical Performance

| Metric | Target |
|---|---|
| Trigger → first alert dispatched | < 10 seconds |
| Messenger bot response time | < 5 seconds |
| Road Assist contacts load time | < 3 seconds (online), instant (offline) |
| Border crossing detection accuracy | > 99% |
| Offline mode reliability | 99.9% |
| Crash detection true positive rate | > 92% |
| False alarm rate | < 5% |
| App crash rate | < 0.1% |

### Data Quality (Scored Criterion)

| Metric | Target |
|---|---|
| Total contacts fetched per country | > 200 across all 8 categories |
| Cross-verification rate | > 80% of contacts verified against 2+ sources |
| Data freshness | > 95% of contacts updated within 7 days |
| User-flagged wrong numbers resolved | < 72 hours |
| Offline contact coverage | 100% — all 8 categories available offline |

### 6-Month Pilot Targets

| Milestone | Target |
|---|---|
| Partner hospitals onboarded | 25 across 3 countries |
| Active app installs | 50,000 |
| LINE bot users (Thailand) | 10,000 |
| Community hazard reports / month | 5,000 |
| Breakdown incidents handled | 1,000+ |
| Emergency incidents handled | 200+ |
| Monthly Firebase cost | $0 |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Towing / tyre shop data sparse in rural areas | High | OSM data supplemented by Google Places; rural areas show national hotline as fallback |
| Google Places API returning stale hours | Medium | Show "call to confirm hours" notice on all shop results |
| LINE API approval delay | High | Apply immediately; 4/6 countries covered by WhatsApp meanwhile |
| Firebase free tier exceeded at scale | Medium | Clear upgrade path to Blaze; cost-efficient function design from day one |
| Gemini rate limit at peak | Medium | Cache identical altitude/language first aid responses in Firestore |
| Hospital data stale / wrong | Critical | Multi-source verification + user correction system + 3-day TTL |
| Myanmar data access restrictions | Medium | OpenStreetMap + manual curation; Messenger bot as primary access |
| False motorcycle crash triggers | High | Tuned TFLite model + 10-second cancel window + configurable sensitivity |

---

## 13. Go-to-Market Strategy

**Phase 0 — Hackathon (Now)**
Working demo: all 8 contact categories, 3 messenger bots, Border Mode, Mountain Mode, Road Assist Mode. $0 cost.

**Phase 1 — Pilot (Months 1–3)**
- Thailand: LINE bot, 5 Bangkok trauma centres, motorcycle club partnerships
- Nepal: Kathmandu hospitals, trekking association, mountain road pilot
- Sri Lanka: WhatsApp bot, Colombo National Hospital

**Phase 2 — Regional Expansion (Months 4–12)**
- Bangladesh, Bhutan launches
- Towing company API partnerships (structured data feeds)
- Insurance company integrations (AXA Travel, Tokio Marine Thailand)
- BIMSTEC Secretariat endorsement

**Phase 3 — Institutional Scale (Year 2)**
- Myanmar launch
- BEDS open standard pitched to BIMSTEC Transport Working Group
- Government MoUs for official emergency system integration
- Satellite SOS partnership (Garmin or equivalent) as paid premium tier

---

## 14. The Open Protocol Proposal — BEDS

ROADSOS proposes the **BIMSTEC Emergency Data Standard (BEDS)**: an open JSON format for sharing emergency contacts, incidents, and hazards across all BIMSTEC member states.

```json
{
  "schema": "BEDS-1.0",
  "incident_id": "RDS-TH-20260517-00392",
  "timestamp": "2026-05-17T06:32:11Z",
  "country": "TH",
  "gps": { "lat": 18.7883, "lng": 98.9853, "altitude_m": 312 },
  "incident_type": "road_accident",
  "vehicle_type": "motorcycle",
  "victim": {
    "blood_type": "A+",
    "allergies": ["penicillin"],
    "nationality": "NP",
    "language": "ne",
    "conscious": true
  },
  "contacts_fetched": {
    "hospital": { "name": "Maharaj Nakorn Chiang Mai", "eta_min": 9 },
    "towing": { "name": "Highway Assist Thailand", "phone": "1193" },
    "police": { "name": "Chiang Mai Traffic Police", "phone": "191" }
  },
  "severity_estimate": "moderate",
  "alerts_sent": { "ambulance": true, "family": true, "hospital": true }
}
```

Open-source. Freely adoptable by any hospital, government, or competing app. ROADSOS implements it first.

> *"We are not asking countries to use our app. We are asking them to share one common language for road emergencies. We're just the ones writing the first draft."*

---

## 15. Appendix

### A. Complete Free Stack

| Layer | Service | Cost |
|---|---|---|
| Mobile App | React Native + Expo | Free |
| Maps (online) | react-native-maps + Google Maps Platform | Free ($200 credit) |
| Maps (offline) | OpenStreetMap `.mbtiles` | Free |
| Elevation / LZ finder | SRTM 90m dataset | Free (public domain) |
| Tyre / police offline data | OpenStreetMap tags | Free |
| Geofencing | Turf.js (on-device) | Free |
| Crash detection | TFLite (on-device) | Free |
| Auth | Firebase Authentication | Free |
| Main database | Firestore | Free |
| Real-time tracking | Firebase Realtime DB | Free |
| Backend logic | Firebase Cloud Functions | Free |
| Push notifications | Firebase Cloud Messaging | Free |
| Web dashboard | Firebase Hosting | Free |
| Job scheduling | Cloud Scheduler | Free |
| AI (first aid + bots) | Gemini API — Google AI Studio | Free |
| WhatsApp bot | WhatsApp Business Cloud API | Free (1K conv/month) |
| LINE bot | LINE Messaging API | Free (200 push/month) |
| Messenger bot | Meta Messenger Platform API | Free |
| Hospital / contact data | Government APIs + Google Places | Free |
| **Total monthly cost** | | **$0** |

### B. Evaluation Criteria — Full Coverage Map

| Criterion | How ROADSOS Addresses It | Score Potential |
|---|---|---|
| Police / hospitals / ambulance | Pre-loaded numbers all 6 countries, hospital ranking AI | High |
| Towing / puncture shops / showrooms | Road Assist Mode — dedicated feature, 3 contact types, offline cached | High |
| Global applicability | Country-agnostic architecture, BIMSTEC first, extensible to any country | High |
| Offline functionality | P0 feature, all 8 categories cached offline, freshness stamps shown | High |
| Reliability and data accuracy | Multi-source verification, user correction system, quality dashboard | High |
| Number of contacts fetched | 8 categories × 6 countries — maximised and tracked as KPI | High |
| Offline functionality (repeated) | Demonstrated in demo — airplane mode + all contacts still available | High |
| Innovation & additional features | Border Mode, Mountain Mode, Tourist Card, Hazard Mesh, BEDS, Motorcycle Mode | Very High |
| Information integration across countries | Border Mode + BEDS standard + cross-border migrant worker mode | High |

### C. What Is Deferred (Not Free at Scale)

| Feature | Cost | Plan |
|---|---|---|
| Satellite SOS | ~$25–50/month per device | Phase 2 — hardware partnership |
| LINE at scale > 200 msg/month | Per message | Upgrade when pilot exceeds free tier |
| WhatsApp at scale > 1K conv/month | ~$0.01–0.05/conv | Upgrade when pilot exceeds free tier |
| Vertex AI (Gemini at scale) | Per token | When daily incidents exceed 1,500/day |

---

*ROADSOS PRD v4.0 — BIMSTEC Edition — Evaluation-Aligned — Firebase Stack*
*Road Safety Hackathon 2026*
*"Every second counts. Every contact too."*
