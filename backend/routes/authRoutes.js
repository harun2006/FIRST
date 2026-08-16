const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate the VIP Pass
const generateToken = (role) => {
    return jwt.sign({ role }, process.env.JWT_SECRET || 'swiftcourier_super_secret_key', { expiresIn: '24h' });
};

router.post('/login', async (req, res) => {
    try {
        const loginId = req.body.email || req.body.username; 
        const password = req.body.password;

        console.log(`Login attempt received - ID: ${loginId}, Password: ${password}`);

        // 1. Hardcoded Master Admin Bypass
        if (loginId === "admin@swiftcourier.com" && password === "admin123") {
            return res.status(200).json({ message: "Master Admin login successful", role: "admin", token: generateToken("admin") });
        }
        
        // 2. Hardcoded Branch Manager Bypass
        if (loginId === "branch@swiftcourier.com" && password === "1234") {
            return res.status(200).json({ message: "Branch Manager login successful", role: "branch", token: generateToken("branch") });
        }
        
        // 3. Hardcoded Delivery Agent Bypass
        if (loginId === "driver@swiftcourier.com" && password === "1234") {
            return res.status(200).json({ message: "Delivery Agent login successful", role: "agent", token: generateToken("agent") });
        }

        // 4. Hardcoded Customer Bypass
        if (loginId === "harun@gmail.com" && password === "1234") {
            return res.status(200).json({ message: "Customer login successful", role: "customer", token: generateToken("customer") });
        }

        // 5. Standard Database Check: Look for either an email OR a username
        const user = await User.findOne({
            $or: [
                { email: loginId },
                { username: loginId }
            ]
        });
        
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.status(200).json({ message: "Login successful", role: user.role, token: generateToken(user.role) });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});

router.post('/register', async (req, res) => {
    try {
        // FIXED: Now we grab EVERYTHING the frontend sends us
        const { name, username, email, password, role } = req.body;
        
        // Pass all of it to MongoDB
        const newUser = new User({ name, username, email, password, role });
        
        await newUser.save();
        res.status(201).json({ message: "New user registered successfully!" });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(400).json({ error: "Failed to register user (Email might already exist)" });
    }
});

module.exports = router;