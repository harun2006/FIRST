const SwiftCourier = {
  theme: localStorage.getItem('theme') || 'light',
  
  parcels: JSON.parse(localStorage.getItem('parcels')) || [
    {
      id: 'TRK-98231',
      sender: 'Alice Smith',
      receiver: 'Bob Johnson',
      address: '452 Elm St, New York, NY',
      type: 'Express Parcel',
      weight: 2.5,
      cost: 187.50,
      status: 'Out For Delivery',
      currentLoc: 'Manhattan Hub',
      estDelivery: '2026-07-28',
      history: ['Booked', 'Collected', 'Sorted', 'Dispatched', 'Out For Delivery']
    },
    {
      id: 'TRK-44120',
      sender: 'Tech Corp',
      receiver: 'Charlie Davis',
      address: '12 Mission Rd, San Francisco, CA',
      type: 'Heavy Parcel',
      weight: 12.0,
      cost: 410.00,
      status: 'Delivered',
      currentLoc: 'Destination Reached',
      estDelivery: '2026-07-26',
      history: ['Booked', 'Collected', 'Sorted', 'Dispatched', 'Out For Delivery', 'Delivered']
    }
  ],

  init() {
    this.applyTheme();
    this.setupNavbar();

    // PASTE IT HERE:
    if (!localStorage.getItem('customersCount')) {
      localStorage.setItem('customersCount', '12450');
    }
  },

  // ... rest of your js/app.js methods stay the same

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  },

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
  },

  setupNavbar() {
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    if (burger && nav) {
      burger.addEventListener('click', () => nav.classList.toggle('active'));
    }
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  },

  cancelParcel(trackingId) {
    const parcelIndex = this.parcels.findIndex(p => p.id.toUpperCase() === trackingId.toUpperCase());
    
    if (parcelIndex === -1) {
      this.showToast('Parcel not found.', 'error');
      return false;
    }

    const parcel = this.parcels[parcelIndex];

    if (parcel.status === 'Delivered') {
      this.showToast('Cannot cancel a parcel that is already delivered!', 'error');
      return false;
    }

    if (parcel.status === 'Cancelled') {
      this.showToast('This order is already cancelled.', 'info');
      return false;
    }

    this.parcels[parcelIndex].status = 'Cancelled';
    this.parcels[parcelIndex].currentLoc = 'Cancelled';
    if (!this.parcels[parcelIndex].history.includes('Cancelled')) {
      this.parcels[parcelIndex].history.push('Cancelled');
    }

    localStorage.setItem('parcels', JSON.stringify(this.parcels));
    this.showToast(`Order ${trackingId} has been cancelled successfully.`, 'success');
    return true;
  },

  deleteParcel(trackingId) {
    const initialLength = this.parcels.length;
    this.parcels = this.parcels.filter(p => p.id.toUpperCase() !== trackingId.toUpperCase());

    if (this.parcels.length < initialLength) {
      localStorage.setItem('parcels', JSON.stringify(this.parcels));
      this.showToast(`Order ${trackingId} deleted permanently.`, 'success');
      return true;
    } else {
      this.showToast('Failed to find order to delete.', 'error');
      return false;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => SwiftCourier.init());