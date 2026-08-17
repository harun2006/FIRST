// --- Dynamic Price Calculator ---
const weightInput = document.getElementById('weight');
const speedInput = document.getElementById('speed');
const totalCostDisplay = document.getElementById('totalCost');

function calculateCost() {
    const weight = parseFloat(weightInput.value) || 0;
    const speed = speedInput.value;
    
    // Base fee is $10 + $5 per kg
    let cost = 10 + (weight * 5);
    
    // Add premium for faster delivery
    if (speed === 'express') {
        cost += 15;
    } else if (speed === 'overnight') {
        cost += 30;
    }
    
    // Update the UI
    totalCostDisplay.innerText = `$${cost.toFixed(2)}`;
}

// Listen for changes so the price updates instantly
weightInput.addEventListener('input', calculateCost);
speedInput.addEventListener('change', calculateCost);

// Initialize the price on page load
calculateCost();

// --- Form Submission logic ---
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather data from your HTML input fields
    const bookingData = {
        senderName: document.getElementById('senderName').value,
        senderPhone: document.getElementById('senderPhone').value,
        receiverName: document.getElementById('receiverName').value,
        deliveryAddress: document.getElementById('deliveryAddress').value,
        weight: document.getElementById('weight').value
    };

    try {
        const response = await fetch('https://swiftcourier-backend-live.onrender.com/api/bookings/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert(`Booking Successful! Your Tracking ID is: ${result.trackingId}`);
            document.getElementById('bookingForm').reset(); // Clear the form
            calculateCost(); // Reset the price display
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Failed to connect to the server. Is your backend running?');
    }
});