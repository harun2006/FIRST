const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Secure CORS Configuration
const corsOptions = {
    // Add your live Netlify URL here once you deploy the frontend
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://your-swiftcourier-live-site.netlify.app'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
};

app.use(cors(corsOptions)); 
app.use(express.json());
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));

app.get('/', (req, res) => {
    res.send('Courier Management API is up and running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});