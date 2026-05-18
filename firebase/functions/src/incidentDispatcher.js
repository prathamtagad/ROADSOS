const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { logError } = require("./utils/errorLogger");
const { queryContacts, getUserProfile } = require("./utils/firestoreQueries");
const { sendMessengerMessage } = require("./utils/messenger");
const { COUNTRY_MESSENGER_MAP, EMERGENCY_NUMBERS } = require("./constants/hardcoded");

const db = admin.firestore();
const rtdb = admin.database();

async function runSafe(label, fn, meta = {}) {
  try {
    await fn();
  } catch (error) {
    await logError(label, error, meta);
  }
}

async function alertNearestHospitals(incident, incidentId) {
  const hospitals = await queryContacts({
    country: incident.location.country,
    category: "hospital",
    limitCount: 3
  });

  if (!hospitals.length) {
    return;
  }

  const primary = hospitals[0];

  await db.collection("incidents").doc(incidentId).set(
    {
      assignedHospital: {
        name: primary.name || "",
        phone: primary.phone || "",
        eta: primary.eta || null
      },
      alertsSent: {
        hospital: true
      }
    },
    { merge: true }
  );
}

async function notifyEmergencyContacts(incident, incidentId) {
  const userProfile = await getUserProfile(incident.userId);
  const contacts = userProfile?.emergencyContacts || [];
  const platform = COUNTRY_MESSENGER_MAP[incident.location.country] || "whatsapp";
  const message = `ROADSOS alert: ${incident.type} reported. Location: ${incident.location.lat}, ${incident.location.lng}`;

  await Promise.all(
    contacts.map((contact) =>
      sendMessengerMessage({
        platform,
        to: contact.phone,
        text: message
      })
    )
  );

  await db.collection("incidents").doc(incidentId).set(
    {
      alertsSent: {
        family: true
      }
    },
    { merge: true }
  );
}

async function startLocationTracking(incident, incidentId) {
  await rtdb.ref(`liveTracking/${incidentId}`).set({
    lat: incident.location.lat,
    lng: incident.location.lng,
    altitude: incident.location.altitude || 0,
    updatedAt: Date.now(),
    status: "en_route"
  });
}

async function autoDialAmbulance(incident, incidentId) {
  const country = incident.location.country;
  const ambulanceNumber = EMERGENCY_NUMBERS[country]?.ambulance || null;

  if (!ambulanceNumber) {
    return;
  }

  await admin.messaging().send({
    topic: `user-${incident.userId}`,
    data: {
      action: "dial_ambulance",
      phone: ambulanceNumber,
      incidentId
    }
  });

  await db.collection("incidents").doc(incidentId).set(
    {
      alertsSent: {
        ambulance: true
      }
    },
    { merge: true }
  );
}

async function sendFirstAidToDevice(incident, incidentId) {
  await admin.messaging().send({
    topic: `user-${incident.userId}`,
    data: {
      action: "open_first_aid",
      incidentId
    }
  });
}

async function fetchTowingContacts(incident, incidentId) {
  await queryContacts({
    country: incident.location.country,
    category: "towing",
    limitCount: 5
  });

  await db.collection("incidents").doc(incidentId).set(
    {
      roadAssist: {
        towingContacted: false
      }
    },
    { merge: true }
  );
}

async function fetchTyreShops(incident, incidentId) {
  await queryContacts({
    country: incident.location.country,
    category: "tyre_shop",
    limitCount: 5
  });

  await db.collection("incidents").doc(incidentId).set(
    {
      roadAssist: {
        tyreShopContacted: false
      }
    },
    { merge: true }
  );
}

async function fetchShowrooms(incident, incidentId) {
  const userProfile = await getUserProfile(incident.userId);

  await queryContacts({
    country: incident.location.country,
    category: "showroom",
    limitCount: 3,
    brand: userProfile?.vehicleBrand
  });

  await db.collection("incidents").doc(incidentId).set(
    {
      roadAssist: {
        showroomContacted: false
      }
    },
    { merge: true }
  );
}

async function logBreakdownForAnalytics() {
  return;
}

exports.onIncidentCreated = functions.firestore
  .document("incidents/{incidentId}")
  .onCreate(async (snap, context) => {
    const incident = snap.data();
    const incidentId = context.params.incidentId;

    if (!incident) {
      return;
    }

    if (incident.type === "emergency") {
      await Promise.all([
        runSafe("alertNearestHospitals", () => alertNearestHospitals(incident, incidentId), { incidentId }),
        runSafe("notifyEmergencyContacts", () => notifyEmergencyContacts(incident, incidentId), { incidentId }),
        runSafe("startLocationTracking", () => startLocationTracking(incident, incidentId), { incidentId }),
        runSafe("autoDialAmbulance", () => autoDialAmbulance(incident, incidentId), { incidentId }),
        runSafe("sendFirstAidToDevice", () => sendFirstAidToDevice(incident, incidentId), { incidentId })
      ]);
    }

    if (incident.type === "breakdown") {
      await Promise.all([
        runSafe("fetchTowingContacts", () => fetchTowingContacts(incident, incidentId), { incidentId }),
        runSafe("fetchTyreShops", () => fetchTyreShops(incident, incidentId), { incidentId }),
        runSafe("fetchShowrooms", () => fetchShowrooms(incident, incidentId), { incidentId }),
        runSafe("logBreakdownForAnalytics", () => logBreakdownForAnalytics(incident, incidentId), { incidentId })
      ]);
    }
  });
