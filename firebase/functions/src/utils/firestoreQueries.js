const admin = require("firebase-admin");

const db = admin.firestore();

async function queryContacts({ country, category, limitCount = 5, brand }) {
  let query = db.collection("contacts")
    .where("country", "==", country)
    .where("category", "==", category)
    .limit(limitCount);

  if (brand) {
    query = db.collection("contacts")
      .where("country", "==", country)
      .where("category", "==", category)
      .where("brand", "==", brand)
      .limit(limitCount);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getUserProfile(userId) {
  const snapshot = await db.collection("users").doc(userId).get();
  return snapshot.exists ? snapshot.data() : null;
}

module.exports = {
  queryContacts,
  getUserProfile
};
