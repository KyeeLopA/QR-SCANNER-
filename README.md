
# 🚀 QR Scanner Pro - Progressive Web App (PWA)

Aplikasi pemindai Kode QR modern yang dirancang sebagai Progressive Web App (PWA). Aplikasi ini dapat diinstal langsung ke perangkat seluler (HP) dan berfungsi offline, dengan fitur tambahan pemindaian dari Galeri dan analisis konten QR yang cerdas.

---

## ✨ Fitur Utama

* **PWA Siap Instal:** Aplikasi dapat diinstal langsung di layar utama perangkat Android atau iOS, memberikan pengalaman seperti aplikasi *native*.
* **Pemindaian Ganda:** Mendukung pemindaian langsung menggunakan **kamera belakang** (`facingMode: "environment"`) dan pemrosesan gambar dari **Galeri/Penyimpanan**.
* **Tampilan Modern:** Menggunakan desain bersih dengan efek *Glassmorphism* (kaca buram transparan) pada *header*.
* **Analisis Konten:** Secara otomatis mengidentifikasi dan menjelaskan isi dari kode QR, termasuk:
* Tautan Web (URL)
* Informasi Kontak (VCard/MeCard)
* Detail Koneksi Wi-Fi (SSID & Kata Sandi)
* Teks Biasa


* **Akses Offline:** Berkat Service Worker, aplikasi dapat diakses bahkan tanpa koneksi internet.

---

## 🛠️ Instalasi dan Struktur Proyek

Aplikasi ini dibangun menggunakan HTML, CSS (murni), dan JavaScript (Vanilla JS) dengan memanfaatkan library `jsQR` untuk pemindaian.

### Struktur Folder

```
qr-scanner-pro/
├── index.html          # Halaman utama aplikasi
├── style.css           # Gaya tampilan (Modern, Glassmorphism)
├── script.js           # Logika utama, kamera, galeri, dan PWA
├── manifest.json       # Metadata aplikasi untuk instalasi PWA
├── service-worker.js   # Skrip untuk caching dan offline
└── icons/              # Folder WAJIB untuk ikon PWA
    ├── icon-192x192.png
    └── icon-512x512.png

```

### Persyaratan

1. Web Server (Misalnya: Live Server di VS Code, Apache, Nginx, atau Firebase Hosting).
2. Browser modern (Chrome, Firefox, Safari) di perangkat seluler.

---

## 📱 Cara Instalasi (Progressive Web App - PWA)

Aplikasi ini dirancang untuk diinstal langsung ke perangkat Anda, membuatnya tersedia di layar utama (home screen).

### Di Perangkat Android (Chrome)

1. Buka aplikasi melalui URL server Anda.
2. Tekan tombol menu **⋮** (tiga titik) di sudut kanan atas browser.
3. Pilih opsi **"Install app"** atau **"Tambahkan ke Layar Utama"**.
4. Aplikasi akan terinstal dan terbuka di jendela *standalone* tanpa bilah alamat browser.

### Di Perangkat iOS (Safari)

1. Buka aplikasi melalui URL server Anda.
2. Tekan **tombol Share** (kotak dengan panah ke atas) di bagian bawah browser.
3. Pilih opsi **"Add to Home Screen"** atau **"Tambahkan ke Layar Utama"**.
4. Aplikasi akan muncul sebagai ikon baru di layar utama Anda.

---

## ⚙️ Cara Kerja Pemindaian Galeri

Saat Anda memilih **"🖼️ Ambil dari Galeri"**:

1. Kamera Live dihentikan, dan dialog pemilihan file muncul.
2. Gambar yang Anda pilih diunggah secara lokal di browser (tanpa dikirim ke server).
3. JavaScript menggunakan elemen **Canvas** untuk mengambil data piksel gambar tersebut.
4. Library `jsQR` memindai piksel gambar tersebut.
5. Hasil data QR ditampilkan dan dianalisis menggunakan fungsi `explainContent()`.

---

## 📜 Lisensi

Proyek ini bersifat *open-source*. Anda bebas menggunakan, memodifikasi, dan mendistribusikannya.

---

*(Pastikan Anda mengganti `/icons/icon-192x192.png` dan `icon-512x512.png` dengan gambar ikon Anda sendiri.)*
