const verify = require('../middleware/verifyToken');
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// 1. Create a new booking (For booking.html) - LEFT UNPROTECTED FOR PUBLIC USE
router.post('/', async (req, res) => {
    try {
        const generatedTrackingId = 'TRK' + Math.floor(10000000 + Math.random() * 90000000);
        const newBooking = new Booking({
            ...req.body,
            trackingId: generatedTrackingId
        });
        const savedBooking = await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', trackingId: savedBooking.trackingId });
    } catch (error) {
        res.status(400).json({ error: 'Failed to create booking', details: error.message });
    }
});

// 2. Get all bookings (For admin.html) - PROTECTED
router.get('/all', verify, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
    }
});

// 3. Update parcel status & location (For admin.html) - PROTECTED
router.put('/update/:id', verify, async (req, res) => {
    try {
        const { status, currentLocation } = req.body;
        const updatedBooking = await Booking.findOneAndUpdate(
            { trackingId: req.params.id },
            { status, currentLocation },
            { new: true }
        );
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Parcel not found' });
        }
        res.status(200).json({ message: 'Status updated successfully', data: updatedBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status', details: error.message });
    }
});

// 4. GET a single parcel by Tracking ID (For tracking.html) - LEFT UNPROTECTED FOR PUBLIC USE
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

// 5. DELETE a parcel by Tracking ID (For admin.html) - PROTECTED
router.delete('/:trackingId', verify, async (req, res) => {
    try {
        const deletedParcel = await Booking.findOneAndDelete({ trackingId: req.params.trackingId });
        
        if (!deletedParcel) {
            return res.status(404).json({ error: "Parcel not found" });
        }
        
        res.status(200).json({ message: "Parcel deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete parcel" });
    }
});

module.exports = router;