const admin = require("firebase-admin");

async function logError(source, error, meta = {}) {
  const payload = {
    source,
    message: error?.message || "Unknown error",
    name: error?.name || "Error",
    stack: error?.stack || null,
    meta,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  try {
    await admin.firestore().collection("errors").add(payload);
  } catch (innerError) {
    console.warn("Failed to write errors", innerError);
  }
}

module.exports = {
  logError
};
