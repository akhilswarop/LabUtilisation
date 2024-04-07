const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient } = require('mongodb');
const { env } = require('process');

const app = express();
const PORT =3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connection URI
const uri = "mongodb+srv://akhiltheswarop:Dirtbikebruh%4012@bookinginformation.j3kqyng.mongodb.net/"

// Database Name
const dbName = 'bookinginfo'; // Replace with your database name

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB server
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

// Call the connectToMongoDB function to establish the connection
connectToMongoDB();

// API endpoint to handle booking requests
app.post('/bookings', async (req, res) => {
    const bookingData = req.body;
    try {
        // Connect to the MongoDB server
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('Booking');
        // Insert the booking data into the "bookings" collection
        await collection.insertMany(bookingData);
        console.log('Booking data inserted into MongoDB:', bookingData);
        res.status(201).send('Booking completed successfully');
    } catch (err) {
        console.error('Error inserting booking data into MongoDB:', err);
        res.status(500).send('Internal Server Error');
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
});
// Endpoint to retrieve booked seat information
app.get('/bookings', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('Booking');
        // Fetch all booked seats from the collection
        const bookedSeats = await collection.find({}).toArray();
        res.status(200).json(bookedSeats);
    } catch (err) {
        console.error('Error fetching booked seat information:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route handler for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ManageAndTrack.html')); // Serve ManageAndTrack.html
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
