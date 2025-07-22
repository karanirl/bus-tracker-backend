// server.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send("✅ Server is working!");
});
// In-memory storage
let busLocations = {};

// Route: Update Location
app.post('/update-location', (req, res) => {
  const { busId, latitude, longitude } = req.body;

  if (!busId || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing busId, latitude, or longitude" });
  }

  currentLocation = { latitude, longitude };

  // Save to Firebase Firestore
  db.collection('busLocations').doc(busId).set({
    latitude,
    longitude,
    timestamp: new Date()
  })
  .then(() => {
    res.json({ message: 'Location updated successfully and saved to Firebase' });
  })
  .catch((error) => {
    res.status(500).json({ error: 'Failed to update Firebase', details: error.message });
  });
});


// Route: Get Location
app.get('/bus-location/:busId', (req, res) => {
  const { busId } = req.params;

  if (!busLocations[busId]) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  res.json(busLocations[busId]);
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});

