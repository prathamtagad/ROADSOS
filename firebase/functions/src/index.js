const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

const { onIncidentCreated } = require("./incidentDispatcher");
const { responderDispatch } = require("./responderDispatch");

exports.onIncidentCreated = onIncidentCreated;
exports.responderDispatch = responderDispatch;
