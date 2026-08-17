const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Secure CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:5500', 
        'http://127.0.0.1:5500', 
        'https://swiftcourier-frontend.onrender.com'
    ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
};

app.use(cors(corsOptions)); 
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.send('Courier Management API is up and running!');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));

// Server Listen (This keeps the app awake!)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});