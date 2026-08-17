const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    trackingId: { type: String, required: true, unique: true },
    userId: { type: String, required: false }, // THE MISSING LINK: This permanently ties the parcel to the customer!
    senderName: { type: String, required: true },
    senderPhone: { type: String, required: true },
    receiverName: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    weight: { type: Number, required: true }, 
    status: { 
        type: String, 
        enum: ['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'], // Added Cancelled so customers don't break the database when cancelling
        default: 'Pending'
    },
    currentLocation: { type: String, default: 'Origin Branch' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);