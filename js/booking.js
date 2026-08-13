document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const weightInput = document.getElementById('weight');
  const speedInput = document.getElementById('speed');
  const totalCostElement = document.getElementById('totalCost');

  function calculateCharge() {
    const weight = parseFloat(weightInput?.value) || 0;
    const speed = speedInput?.value || 'standard';
    
    let baseRate = 50; // Base charge in ₹
    let weightRate = weight * 30; // ₹30 per kg
    let multiplier = speed === 'express' ? 1.5 : (speed === 'overnight' ? 2.0 : 1.0);

    let total = (baseRate + weightRate) * multiplier;
    if (totalCostElement) {
      totalCostElement.innerText = `₹${total.toFixed(2)}`;
    }
    return total;
  }

  if (weightInput && speedInput) {
    weightInput.addEventListener('input', calculateCharge);
    speedInput.addEventListener('change', calculateCharge);
    calculateCharge(); // Initial calculation on load
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const trackingId = 'TRK-' + Math.floor(10000 + Math.random() * 90000);
      const newParcel = {
        id: trackingId,
        sender: document.getElementById('senderName').value,
        receiver: document.getElementById('receiverName').value,
        address: document.getElementById('receiverAddress').value,
        type: document.getElementById('parcelType').value,
        weight: parseFloat(weightInput.value),
        cost: calculateCharge(),
        status: 'Booked',
        currentLoc: 'Origin Hub',
        estDelivery: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        history: ['Booked']
      };

      SwiftCourier.parcels.push(newParcel);
      localStorage.setItem('parcels', JSON.stringify(SwiftCourier.parcels));
      
      SwiftCourier.showToast(`Parcel Booked Successfully! Tracking ID: ${trackingId}`, 'success');
      setTimeout(() => window.location.href = `tracking.html?id=${trackingId}`, 1500);
    });
  }
});