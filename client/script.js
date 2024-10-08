// Fungsi untuk mengambil data terbaru dari server
async function fetchData() {
  try {
      const response = await fetch('/api/latest-data');
      const data = await response.json();

      // Update nilai kelembaban tanah dan waktu terakhir disiram
      document.getElementById('soilMoisture').textContent = data.soilMoisture + '%';
      document.getElementById('lastWatered').textContent = new Date(data.lastWatered).toLocaleString();

      // Update status pompa di UI
      updatePumpStatus(data.pumpStatus);

      // Tambahkan data terbaru ke grafik kelembaban
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
      const newStatus = !currentStatus;

      const response = await fetch('/api/toggle-pump', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ pumpStatus: newStatus })
      });

      if (response.ok) {
          // Update status pompa di UI setelah berhasil mengubah status
          updatePumpStatus(newStatus);

          // Tampilkan notifikasi bahwa pompa akan tetap menyala selama 1 menit
          if (newStatus) {
              alert('Pompa akan tetap menyala selama 1 menit sebelum kembali ke mode otomatis.');
          }
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
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Kelembaban Tanah: ${context.raw}%`;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length) {
        // Ambil data dari grafik atau panggil fungsi untuk menampilkan data ringkasan
        fetchHistoryData();
      }
    }
  }
});
// Fungsi untuk menambahkan data ke grafik
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

/// Existing code...

// Fungsi untuk mengambil data terbaru dari server
async function fetchData() {
  try {
      const response = await fetch('/api/latest-data');
      const data = await response.json();

      // Update nilai kelembaban tanah dan waktu terakhir disiram
      document.getElementById('soilMoisture').textContent = data.soilMoisture + '%';
      document.getElementById('lastWatered').textContent = new Date(data.lastWatered).toLocaleString();

      // Update status pompa di UI
      updatePumpStatus(data.pumpStatus);

      // Tambahkan data terbaru ke grafik kelembaban
      addData(moistureChart, new Date().toLocaleTimeString(), data.soilMoisture);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// ... (rest of the existing functions)

// Fungsi untuk mendapatkan data riwayat kelembaban harian
async function fetchHistoryData() {
  try {
      const response = await fetch('/api/history');
      const historyData = await response.json();

      const labels = historyData.map(entry => entry.date);
      const moistureData = historyData.map(entry => entry.avg_moisture);

      const ctxHistory = document.getElementById('historyChart').getContext('2d');
      new Chart(ctxHistory, {
          type: 'line',
          data: {
              labels: labels,
              datasets: [{
                  label: 'Rata-rata Kelembaban Harian (%)',
                  data: moistureData,
                  borderColor: '#FFB6C1',
                  backgroundColor: 'rgba(255, 182, 193, 0.1)',
                  borderWidth: 2,
                  pointRadius: 3,
                  pointBackgroundColor: '#FFB6C1',
                  pointBorderColor: '#FFF',
                  pointHoverRadius: 5,
                  fill: true,
                  tension: 0.4
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                  x: {
                      type: 'time',
                      time: {
                          unit: 'day',
                          displayFormats: {
                              day: 'MMM d'
                          }
                      },
                      title: {
                          display: true,
                          text: 'Tanggal'
                      }
                  },
                  y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                          display: true,
                          text: 'Kelembaban Tanah (%)'
                      }
                  }
              },
              plugins: {
                  legend: {
                      display: false
                  },
                  tooltip: {
                      mode: 'index',
                      intersect: false,
                      callbacks: {
                          label: function(context) {
                              return `Kelembaban: ${context.parsed.y.toFixed(2)}%`;
                          }
                      }
                  }
              },
              interaction: {
                  mode: 'nearest',
                  axis: 'x',
                  intersect: false
              }
          }
      });
  } catch (error) {
      console.error('Error fetching history data:', error);
  }
}

// Panggil fetchHistoryData saat halaman dimuat
fetchHistoryData();

// ... (rest of the existing code)

// Tambahkan event listener untuk tombol
document.getElementById('togglePump').addEventListener('click', togglePump);
