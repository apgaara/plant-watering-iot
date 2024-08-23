# Dashboard Pemantauan Tanaman

## Deskripsi
Proyek ini adalah sistem pemantauan tanaman yang menggunakan ESP8266 untuk mengukur kelembaban tanah dan intensitas cahaya. Data dikirim ke server dan ditampilkan di dashboard web.

## Struktur Proyek
- `/api`: Kode untuk server API Node.js.
- `/client`: Kode frontend untuk tampilan web.
- `/arduino`: Kode untuk ESP8266/Arduino.
- `/data`: (Opsional) Untuk menyimpan data atau log.
- `README.md`: Dokumentasi proyek.

## Setup
1. **API Server**
   - Navigasikan ke folder `/api`.
   - Jalankan `npm install` untuk menginstal dependensi.
   - Jalankan `node index.js` untuk memulai server.

2. **Frontend**
   - Navigasikan ke folder `/client`.
   - Buka `index.html` di browser.

3. **Arduino**
   - Upload `your-sketch.ino` ke ESP8266 menggunakan Arduino IDE.

## Konfigurasi
- **API URL**: Pastikan URL di `sendDataToServer` pada kode Arduino sesuai dengan alamat server API Anda.
- **Frontend**: Pastikan endpoint API yang digunakan di `fetch` pada `script.js` sesuai dengan alamat server API Anda.

## Lisensi
MIT License
