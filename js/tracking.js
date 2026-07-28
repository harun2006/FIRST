document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const trackIdParam = urlParams.get('id');
  const trackBtn = document.getElementById('trackBtn');
  const searchInput = document.getElementById('trackSearchInput');

  if (trackIdParam && searchInput) {
    searchInput.value = trackIdParam;
    renderTracking(trackIdParam);
  }

  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      const id = searchInput.value.trim();
      renderTracking(id);
    });
  }
});

function renderTracking(trackingId) {
  const parcel = SwiftCourier.parcels.find(p => p.id.toUpperCase() === trackingId.toUpperCase());
  const displayContainer = document.getElementById('trackingResult');

  if (!displayContainer) return;

  if (!parcel) {
    displayContainer.innerHTML = `<div class="glass" style="padding: 30px; text-align: center;"><p>No parcel found with Tracking ID <strong>${trackingId}</strong></p></div>`;
    return;
  }

  const steps = ['Booked', 'Collected', 'Sorted', 'Dispatched', 'Out For Delivery', 'Delivered'];
  
  let timelineHTML = '<div class="timeline">';
  steps.forEach((step) => {
    const isCompleted = parcel.history.includes(step);
    timelineHTML += `
      <div class="timeline-step ${isCompleted ? 'active' : ''}">
        <div class="step-icon"><i class="fas ${isCompleted ? 'fa-check' : 'fa-circle'}"></i></div>
        <p class="step-label">${step}</p>
      </div>
    `;
  });
  timelineHTML += '</div>';

  displayContainer.innerHTML = `
    <div class="glass" style="padding:30px; margin-top:20px;">
      <h2>Package Status: <span style="color:var(--primary);">${parcel.status}</span></h2>
      <p><strong>Tracking ID:</strong> ${parcel.id}</p>
      <p><strong>Sender:</strong> ${parcel.sender} | <strong>Receiver:</strong> ${parcel.receiver}</p>
      <p><strong>Current Location:</strong> ${parcel.currentLoc}</p>
      <p><strong>Est. Delivery:</strong> ${parcel.estDelivery}</p>
      <hr style="margin:20px 0; border:0; border-top:1px solid var(--glass-border);">
      ${timelineHTML}
    </div>
  `;
}