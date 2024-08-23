async function fetchData() {
    try {
      const response = await fetch('/api/latest-data');
      const data = await response.json();
  
      document.getElementById('soilMoisture').textContent = data.soilMoisture + '%';
      document.getElementById('lastWatered').textContent = new Date(data.lastWatered).toLocaleString();
   
  
      if (data.soilMoisture < 30) { // Adjust threshold as necessary
        document.getElementById('pumpStatus').textContent = 'AKTIF';
        document.getElementById('pumpStatus').className = 'status-on';
      } else {
        document.getElementById('pumpStatus').textContent = 'NONAKTIF';
        document.getElementById('pumpStatus').className = 'status-off';
      }
  
      addData(moistureChart, new Date().toLocaleTimeString(), data.soilMoisture);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Panggil fetchData secara berkala dan satu kali pada awal
  fetchData();
  setInterval(fetchData, 5000);
  
//   function updateLightData(lightValue) {
//     document.getElementById('lightIntensity').textContent = lightValue;
  
//     // Misalnya jika nilai LDR lebih besar dari 800, cahaya dianggap kurang
//     if (lightValue > 800) {
//       document.getElementById('lightAlert').style.display = 'block';
//     } else {
//       document.getElementById('lightAlert').style.display = 'none';
//     }
//   }
  
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
  
  document.getElementById('togglePump').addEventListener('click', function() {
    const pumpStatus = document.getElementById('pumpStatus');
    if (pumpStatus.textContent === 'AKTIF') {
      pumpStatus.textContent = 'NONAKTIF';
      pumpStatus.className = 'status-off';
    } else {
      pumpStatus.textContent = 'AKTIF';
      pumpStatus.className = 'status-on';
    }
  });
  