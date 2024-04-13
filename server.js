const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cultureconnect', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// MongoDB Schema for accommodations, restaurants, and activities
const itemSchema = new Schema({
    name: String,
    description: String,
    location: String,
    price: String
});

const Accommodation = mongoose.model('Accommodation', itemSchema);
const Restaurant = mongoose.model('Restaurant', itemSchema);
const Activity = mongoose.model('Activity', itemSchema);

// Sample data for accommodations, restaurants, and activities
const sampleData = {
    accommodations: [
        { name: 'Hotel A', description: 'Luxury hotel in the heart of the city', location: 'City A', price: '$100/night' },
        { name: 'Hotel B', description: 'Cozy boutique hotel with stunning views', location: 'City B', price: '$120/night' }
        // Add more data as needed
    ],
    restaurants: [
        { name: 'Restaurant A', description: 'Fine dining experience with international cuisine', location: 'City A', price: '$$$' },
        { name: 'Restaurant B', description: 'Casual eatery serving local delicacies', location: 'City B', price: '$$' }
        // Add more data as needed
    ],
    activities: [
        { name: 'Tour A', description: 'Guided city tour with historical landmarks', location: 'City A', price: '$50/person' },
        { name: 'Tour B', description: 'Adventure hike through scenic trails', location: 'City B', price: '$40/person' }
        // Add more data as needed
    ]
};

// Populate MongoDB with sample data
db.once('open', async () => {
    try {
        await Promise.all([
            Accommodation.deleteMany({}),
            Restaurant.deleteMany({}),
            Activity.deleteMany({})
        ]);

        await Promise.all([
            Accommodation.insertMany(sampleData.accommodations),
            Restaurant.insertMany(sampleData.restaurants),
            Activity.insertMany(sampleData.activities)
        ]);

        console.log('Sample data inserted successfully');
    } catch (error) {
        console.error('Error inserting sample data:', error);
    }
});

// Setup Passport JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, done) => {
    // You can perform database operations here to find the user based on jwtPayload.sub (subject)
    return done(null, jwtPayload);
}));

// API endpoint for items (accommodations, restaurants, and activities)
app.get('/api/items/:type', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { type } = req.params;

    try {
        let items;
        switch (type) {
            case 'accommodations':
                items = await Accommodation.find({});
                break;
            case 'restaurants':
                items = await Restaurant.find({});
                break;
            case 'activities':
                items = await Activity.find({});
                break;
            default:
                return res.status(400).json({ error: 'Invalid item type' });
        }

        res.json(items);
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        res.status(500).json({ error: `Failed to fetch ${type}` });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    // Here you can perform authentication and generate a JWT token
    const { username, password } = req.body;
    // Example authentication logic, replace with your own
    if (username === 'user' && password === 'password') {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
