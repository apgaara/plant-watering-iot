async function fetchData() {
  try {
      const response = await fetch('/api/latest-data');
      const data = await response.json();

      document.getElementById('soilMoisture').textContent = data.soilMoisture + '%';
      document.getElementById('lastWatered').textContent = new Date(data.lastWatered).toLocaleString();

      updatePumpStatus(data.pumpStatus);

      addData(moistureChart, new Date().toLocaleTimeString(), data.soilMoisture);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Fungsi untuk mengupdate status pompa di UI
function updatePumpStatus(status) {
  const pumpStatusElem = document.getElementById('pumpStatus');
  if (status) {
      pumpStatusElem.textContent = 'AKTIF';
      pumpStatusElem.className = 'status-on';
  } else {
      pumpStatusElem.textContent = 'NONAKTIF';
      pumpStatusElem.className = 'status-off';
  }
}

// Fungsi untuk mengirimkan permintaan untuk mengubah status pompa
async function togglePump() {
  try {
      const currentStatus = document.getElementById('pumpStatus').textContent === 'AKTIF';
      const newStatus = !currentStatus; // Toggle status

      const response = await fetch('/api/toggle-pump', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ pumpStatus: newStatus })
      });

      if (response.ok) {
          updatePumpStatus(newStatus);
      } else {
          console.error('Failed to toggle pump status.');
      }
  } catch (error) {
      console.error('Error toggling pump status:', error);
  }
}

// Panggil fetchData secara berkala dan satu kali pada awal
fetchData();
setInterval(fetchData, 5000);

const ctx = document.getElementById('moistureChart').getContext('2d');
const moistureChart = new Chart(ctx, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{
          label: 'Kelembaban Tanah (%)',
          data: [],
          borderColor: '#FFB6C1',
          tension: 0.1,
          fill: false
      }]
  },
  options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
          y: {
              beginAtZero: true,
              max: 100
          }
      }
  }
});

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
  });
  if (chart.data.labels.length > 10) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
  }
  chart.update();
}

// Tambahkan event listener untuk tombol
document.getElementById('togglePump').addEventListener('click', togglePump);
