const { Firestore } = require("@google-cloud/firestore");

const db = new Firestore({ projectId: process.env.PROJECT_ID });

module.exports = db;
