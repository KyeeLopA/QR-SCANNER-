// Dapatkan elemen-elemen dari HTML
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const outputMessage = document.getElementById('output-message');
const outputExplanation = document.getElementById('output-explanation');

const fileInput = document.getElementById('file-input');
const cameraButton = document.getElementById('camera-button');
const galleryButton = document.getElementById('gallery-button');

let isCameraMode = true;
let isScanning = false;
let animationFrameId;

// --- Bagian 1: Pengaturan Kamera ---

function startCamera() {
    if (video.srcObject) {
        stopCamera();
    }
    
    outputMessage.innerText = "Memuat kamera...";
    outputExplanation.classList.add('hidden');

    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: "environment" 
        } 
    })
    .then(function(stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        isScanning = true;
        
        video.onloadedmetadata = () => {
             animationFrameId = requestAnimationFrame(tick);
        };
    })
    .catch(function(err) {
        console.error("Gagal mengakses kamera: ", err);
        outputMessage.innerText = "Gagal mengakses kamera. Pastikan izin kamera diberikan.";
        video.classList.remove('scanning');
    });
}

function stopCamera() {
    isScanning = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    const stream = video.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.srcObject = null;
    video.classList.remove('scanning', 'found');
}

// --- Bagian 2: Loop Pemindaian Kamera ('tick' function) ---

function tick() {
    if (!isScanning) return;

    outputMessage.innerText = "Mencari QR Code...";
    outputExplanation.classList.add('hidden');
    video.classList.add('scanning');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code) {
            handleQRCode(code.data);
            return; 
        }
    }

    animationFrameId = requestAnimationFrame(tick);
}

// --- Bagian 3: Mode Galeri (Pemindaian Gambar) ---

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        if (!isCameraMode) {
             // Jika dibatalkan, kembali ke mode kamera
             switchMode('camera'); 
        }
        return;
    }

    stopCamera();
    outputMessage.innerText = "Memproses gambar dari Galeri...";
    outputExplanation.classList.add('hidden');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                handleQRCode(code.data);
            } else {
                outputMessage.innerHTML = '❌ **Kode QR Tidak Ditemukan** dalam gambar ini.';
                outputExplanation.classList.remove('hidden');
                outputExplanation.innerHTML = '<p>Silakan coba gambar lain atau alihkan ke Scan Langsung.</p>';
            }
        };
        img.src = e.target.result; 
    };
    reader.readAsDataURL(file); 
}

// --- Bagian 4: Pengelolaan Mode & UI ---

function switchMode(mode) {
    if (mode === 'camera') {
        if (!isCameraMode) {
            isCameraMode = true;
            document.body.classList.remove('gallery-mode');
            cameraButton.classList.add('active');
            galleryButton.classList.remove('active');
            fileInput.value = null; 
            startCamera();
        }
    } else if (mode === 'gallery') {
        if (isCameraMode || isScanning) {
            isCameraMode = false;
            stopCamera();
            document.body.classList.add('gallery-mode');
            galleryButton.classList.add('active');
            cameraButton.classList.remove('active');
            
            fileInput.click(); 
        }
    }
}

// --- Bagian 5: Proses Hasil QR Code & Penjelasan ---

function handleQRCode(data) {
    isScanning = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    if (isCameraMode) {
        video.classList.remove('scanning');
        video.classList.add('found'); 
    }

    outputMessage.innerHTML = `✅ **Kode Ditemukan!**`;
    outputExplanation.classList.remove('hidden');
    
    const explanation = explainContent(data);
    outputExplanation.innerHTML = `
        <p><strong>Konten Asli:</strong> <code>${data}</code></p>
        <p><strong>Analisis:</strong> ${explanation}</p>
    `;
    
    if (isCameraMode) {
        setTimeout(() => {
            isScanning = true;
            animationFrameId = requestAnimationFrame(tick);
        }, 4000); 
    }
}

// Fungsi ini mengurai dan menjelaskan isi QR
function explainContent(content) {
    content = content.trim();

    if (content.startsWith('http')) {
        return `Ini adalah **Tautan Web (URL)**. Anda dapat mengklik untuk membuka halaman: <a href="${content}" target="_blank">${content}</a>`;
    } else if (content.startsWith('BEGIN:VCARD') || content.startsWith('MECARD:')) {
        return `Ini adalah **Kartu Kontak (VCard/MeCard)**. Data yang tersimpan adalah informasi kontak (Nama, Telepon, Email, dll.).`;
    } else if (content.startsWith('WIFI:')) {
        const matchS = content.match(/S:([^;]+)/);
        const matchP = content.match(/P:([^;]+)/);
        const matchT = content.match(/T:([^;]+)/);

        const ssid = matchS ? matchS[1] : 'N/A';
        const password = matchP ? matchP[1] : 'N/A';
        const type = matchT ? matchT[1] : 'N/A';

        return `Ini adalah **Koneksi Wi-Fi**. 
                Nama Jaringan (SSID): <strong>${ssid}</strong>, 
                Kata Sandi: <strong>${password}</strong>, 
                Tipe Keamanan: <strong>${type}</strong>.`;
    } else if (content.startsWith('SMSTO:') || content.startsWith('MATMSG:')) {
        return `Ini adalah **Pesan yang sudah diformat** (SMS atau Email).`;
    } else {
        return `Ini adalah **Teks/Data Biasa**. Isi kode: ${content}`;
    }
}


// --- Bagian 6: Inisialisasi Aplikasi (PWA dan Awal) ---

cameraButton.addEventListener('click', () => switchMode('camera'));
galleryButton.addEventListener('click', () => switchMode('gallery'));
fileInput.addEventListener('change', handleImageUpload); 

// --- PWA: Mendaftarkan Service Worker ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful:', registration.scope);
      }, err => {
        console.error('ServiceWorker registration failed:', err);
      });
  });
}

// Mulai aplikasi dalam mode kamera saat dimuat
switchMode('camera');