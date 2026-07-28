document.addEventListener('DOMContentLoaded', () => {
  renderCustomerTable();
  renderAdminCharts();
});

function renderCustomerTable() {
  const tableBody = document.getElementById('customerParcelsTable');
  if (!tableBody) return;

  tableBody.innerHTML = SwiftCourier.parcels.map(p => `
    <tr>
      <td><strong>${p.id}</strong></td>
      <td>${p.receiver}</td>
      <td>${p.type}</td>
      <td><span class="badge ${p.status.toLowerCase().includes('delivered') ? 'delivered' : 'transit'}">${p.status}</span></td>
      <td>$${p.cost.toFixed(2)}</td>
      <td><a href="tracking.html?id=${p.id}" class="btn btn-secondary" style="padding:4px 12px; font-size:0.8rem;">Track</a></td>
    </tr>
  `).join('');
}

function renderAdminCharts() {
  const barCanvas = document.getElementById('barChartCanvas');
  const pieCanvas = document.getElementById('pieChartCanvas');

  if (barCanvas && barCanvas.getContext) {
    const ctx = barCanvas.getContext('2d');
    ctx.fillStyle = '#1565C0';
    ctx.fillRect(20, 100, 40, 80);
    ctx.fillRect(80, 60, 40, 120);
    ctx.fillRect(140, 40, 40, 140);
    ctx.fillRect(200, 80, 40, 100);
  }

  if (pieCanvas && pieCanvas.getContext) {
    const ctx = pieCanvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(75, 75, 60, 0, Math.PI * 1.3);
    ctx.lineTo(75, 75);
    ctx.fillStyle = '#FF9800';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(75, 75, 60, Math.PI * 1.3, Math.PI * 2);
    ctx.lineTo(75, 75);
    ctx.fillStyle = '#1565C0';
    ctx.fill();
  }
}