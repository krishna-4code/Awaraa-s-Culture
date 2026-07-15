const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(__dirname, 'public', 'hero-sequence');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const fileUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1280&q=80';
const tempFile = path.join(outDir, 'source.jpg');

const file = fs.createWriteStream(tempFile);
https.get(fileUrl, (response) => {
  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
    // Handle redirect
    https.get(response.headers.location, (res2) => {
      res2.pipe(file);
      file.on('finish', copyFrames);
    });
  } else {
    response.pipe(file);
    file.on('finish', copyFrames);
  }
});

function copyFrames() {
  file.close();
  for (let i = 1; i <= 150; i++) {
    const num = i.toString().padStart(4, '0');
    fs.copyFileSync(tempFile, path.join(outDir, `frame_${num}.jpg`));
  }
  fs.unlinkSync(tempFile);
  console.log('Successfully mocked 150 frames!');
}
