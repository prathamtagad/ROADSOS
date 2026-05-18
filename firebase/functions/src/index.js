const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

const { onIncidentCreated } = require("./incidentDispatcher");

exports.onIncidentCreated = onIncidentCreated;
