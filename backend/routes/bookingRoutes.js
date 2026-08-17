const verify = require('../middleware/verifyToken');
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// 1. Create a new booking (Smart Route: Handles both Guests & Logged-in Customers)
router.post('/', (req, res, next) => {
    // If a token is provided (Logged in user), verify it. Otherwise, proceed as guest.
    if (req.headers.authorization) {
        verify(req, res, next);
    } else {
        next();
    }
}, async (req, res) => {
    try {
        const generatedTrackingId = 'TRK' + Math.floor(10000000 + Math.random() * 90000000);
        
        const bookingData = {
            ...req.body,
            trackingId: generatedTrackingId
        };

        // SECURITY FEATURE: If the user was logged in, stamp the booking with their ID!
        if (req.user) {
            bookingData.userId = req.user.id || req.user._id || req.user.userId;
        }

        const newBooking = new Booking(bookingData);
        const savedBooking = await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', trackingId: savedBooking.trackingId });
    } catch (error) {
        res.status(400).json({ error: 'Failed to create booking', details: error.message });
    }
});

// 2. Get bookings (Filtered by Role!)
router.get('/all', verify, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.userId;
        const userRole = req.user.role;

        let bookings;
        
        // SECURITY FEATURE: Admins and Branches see everything. Customers ONLY see their own.
        if (userRole === 'admin' || userRole === 'branch') {
            bookings = await Booking.find().sort({ createdAt: -1 });
        } else {
            bookings = await Booking.find({ userId: userId }).sort({ createdAt: -1 });
        }
        
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
    }
});

// 3. Update parcel status & location (Ownership protected)
router.put('/update/:id', verify, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.userId;
        const userRole = req.user.role;
        const { status, currentLocation } = req.body;

        const parcel = await Booking.findOne({ trackingId: req.params.id });
        if (!parcel) {
            return res.status(404).json({ error: 'Parcel not found' });
        }

        // SECURITY FEATURE: If it is a customer, ensure they own it and are ONLY cancelling it.
        if (userRole === 'customer') {
            if (parcel.userId !== userId) {
                return res.status(403).json({ error: "Unauthorized: You do not own this parcel." });
            }
            if (status !== 'Cancelled') {
                return res.status(403).json({ error: "Customers can only cancel parcels." });
            }
        }

        parcel.status = status;
        parcel.currentLocation = currentLocation;
        const updatedBooking = await parcel.save();

        res.status(200).json({ message: 'Status updated successfully', data: updatedBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status', details: error.message });
    }
});

// 4. GET a single parcel by Tracking ID (Unprotected for Public Tracking Page)
router.get('/:trackingId', async (req, res) => {
    try {
        const parcel = await Booking.findOne({ trackingId: req.params.trackingId });
        
        if (!parcel) {
            return res.status(404).json({ error: "Tracking ID not found. Please check your number." });
        }
        
        res.status(200).json(parcel);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching tracking details." });
    }
});

// 5. DELETE a parcel by Tracking ID (Ownership protected)
router.delete('/:trackingId', verify, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.userId;
        const userRole = req.user.role;

        const parcel = await Booking.findOne({ trackingId: req.params.trackingId });
        if (!parcel) {
            return res.status(404).json({ error: "Parcel not found" });
        }

        // SECURITY FEATURE: Customers can only delete their own data.
        if (userRole === 'customer' && parcel.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized: You do not own this parcel." });
        }

        await Booking.findOneAndDelete({ trackingId: req.params.trackingId });
        res.status(200).json({ message: "Parcel deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete parcel" });
    }
});

module.exports = router;