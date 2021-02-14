var admin = require("firebase-admin");

var serviceAccount = require('./firebasee-sett.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "snaggg-9f621.appspot.com"
});

var storagee = admin.storage();
module.exports = storagee;