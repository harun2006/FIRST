const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    trackingId: { type: String, required: true, unique: true },
    senderName: { type: String, required: true },
    senderPhone: { type: String, required: true },
    receiverName: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    weight: { type: Number, required: true }, 
    status: { 
        type: String, 
        enum: ['Pending', 'In Transit', 'Out for Delivery', 'Delivered'],
        default: 'Pending'
    },
    currentLocation: { type: String, default: 'Origin Branch' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);