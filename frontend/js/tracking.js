document.getElementById('trackBtn').addEventListener('click', trackParcel);

// Optional: Allow the user to press "Enter" on their keyboard to search
document.getElementById('trackSearchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        trackParcel();
    }
});

async function trackParcel() {
    const inputField = document.getElementById('trackSearchInput');
    const resultContainer = document.getElementById('trackingResult');
    const trackingId = inputField.value.trim();

    // 1. Validate Input
    if (!trackingId) {
        resultContainer.innerHTML = `
            <div class="glass" style="padding: 20px; margin-top: 20px; color: #ff6b6b;">
                <i class="fas fa-exclamation-triangle"></i> Please enter a Tracking ID.
            </div>`;
        return;
    }

    // 2. Show a loading state
    resultContainer.innerHTML = `
        <div class="glass" style="padding: 20px; margin-top: 20px; text-align: center;">
            <i class="fas fa-spinner fa-spin"></i> Searching database...
        </div>`;

    try {
        // 3. Fetch data from the backend
        const response = await fetch(`http://127.0.0.1:3000/api/bookings/track/${trackingId}`);
        const data = await response.json();

        // 4. Handle Not Found errors
        if (!response.ok) {
            resultContainer.innerHTML = `
                <div class="glass" style="padding: 20px; margin-top: 20px; color: #ff6b6b;">
                    <i class="fas fa-search-minus"></i> ${data.error || 'Tracking ID not found.'}
                </div>`;
            return;
        }

        // 5. Build the Dynamic Timeline
        const statuses = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered'];
        const icons = ['fa-clipboard-list', 'fa-truck-fast', 'fa-route', 'fa-box-open'];
        
        // Find how far along the parcel is to color the icons correctly
        const currentStatusIndex = statuses.indexOf(data.status);

        let timelineHTML = '<div class="timeline">';
        statuses.forEach((status, index) => {
            // If this step is completed or is the current step, make it active
            const isActive = index <= currentStatusIndex ? 'active' : '';
            timelineHTML += `
                <div class="timeline-step ${isActive}">
                    <div class="step-icon"><i class="fas ${icons[index]}"></i></div>
                    <div class="step-label">${status}</div>
                </div>
            `;
        });
        timelineHTML += '</div>';

        // 6. Display the final result card
        resultContainer.innerHTML = `
            <div class="glass" style="padding: 30px; margin-top: 25px;">
                <h3 style="margin-bottom: 15px; color: var(--primary);">
                    <i class="fas fa-barcode"></i> Tracking Details: ${data.trackingId}
                </h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                    <div>
                        <p style="margin-bottom: 8px;"><strong>Status:</strong> <span style="color: var(--secondary); font-weight: bold; background: rgba(21, 101, 192, 0.1); padding: 4px 8px; border-radius: 4px;">${data.status}</span></p>
                        <p><strong>Location:</strong> ${data.currentLocation}</p>
                    </div>
                    <div>
                        <p style="margin-bottom: 8px;"><strong>Route:</strong> ${data.senderName} <i class="fas fa-arrow-right" style="font-size: 0.8rem; margin: 0 5px;"></i> ${data.receiverName}</p>
                        <p><strong>Weight:</strong> ${data.weight} kg</p>
                    </div>
                </div>
                
                ${timelineHTML}
            </div>
        `;

    } catch (error) {
        console.error('Network Error:', error);
        resultContainer.innerHTML = `
            <div class="glass" style="padding: 20px; margin-top: 20px; color: #ff6b6b;">
                <i class="fas fa-server"></i> Failed to connect to the server. Is your backend running?
            </div>`;
    }
}