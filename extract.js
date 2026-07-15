const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const videoPath = path.join(__dirname, 'public', 'gemini_generated_video_17b7cb55.mp4');
const desktopDir = path.join(__dirname, 'public', 'hero-sequence', 'desktop');
const mobileDir = path.join(__dirname, 'public', 'hero-sequence', 'mobile');

// Cleanup old mock files
const oldDir = path.join(__dirname, 'public', 'hero-sequence');
if (fs.existsSync(oldDir)) {
  const files = fs.readdirSync(oldDir);
  for (const file of files) {
    if (file.endsWith('.jpg')) {
      fs.unlinkSync(path.join(oldDir, file));
    }
  }
}

fs.mkdirSync(desktopDir, { recursive: true });
fs.mkdirSync(mobileDir, { recursive: true });

try {
  console.log('Extracting Desktop frames (1920px, WebP, 24fps)...');
  const commandDesktop = `"${ffmpegPath}" -y -i "${videoPath}" -vf "fps=24,scale=1920:-1" -c:v libwebp -q:v 80 "${path.join(desktopDir, 'frame_%04d.webp')}"`;
  execSync(commandDesktop, { stdio: 'inherit' });
  
  console.log('Extracting Mobile frames (960px, WebP, 24fps)...');
  const commandMobile = `"${ffmpegPath}" -y -i "${videoPath}" -vf "fps=24,scale=960:-1" -c:v libwebp -q:v 70 "${path.join(mobileDir, 'frame_%04d.webp')}"`;
  execSync(commandMobile, { stdio: 'inherit' });
  
  console.log('Extraction complete!');
} catch (err) {
  console.error('Error extracting frames:', err);
}
