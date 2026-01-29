// Generate QR Codes for APK Downloads
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// APK Download URLs (update these with your actual URLs)
const APK_URLS = {
  passenger: 'https://your-hosting-url.com/runrun-passenger.apk',
  driver: 'https://your-hosting-url.com/runrun-driver.apk',
  passengerDirect: 'https://expo.dev/artifacts/eas/[passenger-build-id].apk',
  driverDirect: 'https://expo.dev/artifacts/eas/[driver-build-id].apk',
};

// Output directory
const OUTPUT_DIR = path.join(__dirname, 'qr-codes');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// QR Code options
const qrOptions = {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  quality: 0.95,
  margin: 1,
  width: 500,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
};

async function generateQRCodes() {
  console.log('🔄 Generating QR Codes...\n');

  try {
    // Generate Passenger App QR Code
    console.log('📱 Generating Passenger App QR Code...');
    await QRCode.toFile(
      path.join(OUTPUT_DIR, 'runrun-passenger-qr.png'),
      APK_URLS.passenger,
      qrOptions
    );
    console.log('✅ Passenger App QR Code generated: qr-codes/runrun-passenger-qr.png\n');

    // Generate Driver App QR Code
    console.log('🚗 Generating Driver App QR Code...');
    await QRCode.toFile(
      path.join(OUTPUT_DIR, 'runrun-driver-qr.png'),
      APK_URLS.driver,
      qrOptions
    );
    console.log('✅ Driver App QR Code generated: qr-codes/runrun-driver-qr.png\n');

    // Generate SVG versions (for web)
    console.log('🖼️  Generating SVG versions...');
    const passengerSVG = await QRCode.toString(APK_URLS.passenger, {
      type: 'svg',
      ...qrOptions,
    });
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'runrun-passenger-qr.svg'),
      passengerSVG
    );

    const driverSVG = await QRCode.toString(APK_URLS.driver, {
      type: 'svg',
      ...qrOptions,
    });
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'runrun-driver-qr.svg'),
      driverSVG
    );
    console.log('✅ SVG versions generated\n');

    // Generate HTML preview
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Run-Run Apps - Download QR Codes</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            background-color: #f5f5f5;
        }
        .qr-container {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 40px;
            margin: 40px 0;
        }
        .qr-box {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .qr-box img {
            max-width: 300px;
            border: 3px solid #FF6B00;
            border-radius: 10px;
        }
        .qr-box h2 {
            color: #000;
            margin: 20px 0 10px;
        }
        .qr-box p {
            color: #666;
            font-size: 14px;
        }
        .url {
            font-size: 12px;
            color: #999;
            word-break: break-all;
            margin-top: 10px;
        }
        h1 {
            color: #FF6B00;
        }
    </style>
</head>
<body>
    <h1>🚗 Run-Run Guiné-Bissau</h1>
    <p>Baixe os nossos aplicativos escaneando os códigos QR abaixo:</p>
    
    <div class="qr-container">
        <div class="qr-box">
            <h2>📱 App Passageiro</h2>
            <img src="runrun-passenger-qr.png" alt="Passenger App QR Code">
            <p><strong>Escaneie para baixar</strong></p>
            <p class="url">${APK_URLS.passenger}</p>
        </div>
        
        <div class="qr-box">
            <h2>🚕 App Motorista</h2>
            <img src="runrun-driver-qr.png" alt="Driver App QR Code">
            <p><strong>Escaneie para baixar</strong></p>
            <p class="url">${APK_URLS.driver}</p>
        </div>
    </div>
    
    <p style="margin-top: 40px; color: #999;">
        © 2026 Run-Run Guiné-Bissau | KCDIGITALS<br>
        suporte@runrungb.com | +245 955 981 398
    </p>
</body>
</html>
    `;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'qr-preview.html'), htmlContent);
    console.log('✅ HTML preview generated: qr-codes/qr-preview.html\n');

    console.log('✨ All QR Codes generated successfully!\n');
    console.log('📁 Files created:');
    console.log('   - runrun-passenger-qr.png');
    console.log('   - runrun-passenger-qr.svg');
    console.log('   - runrun-driver-qr.png');
    console.log('   - runrun-driver-qr.svg');
    console.log('   - qr-preview.html\n');
    console.log('📌 Next steps:');
    console.log('   1. Open qr-preview.html in your browser');
    console.log('   2. Update APK URLs in this script with actual download links');
    console.log('   3. Re-run: node generate-qr-codes.js');
    console.log('   4. Upload QR codes to your website\n');
  } catch (error) {
    console.error('❌ Error generating QR codes:', error);
  }
}

// Run the generator
generateQRCodes();
