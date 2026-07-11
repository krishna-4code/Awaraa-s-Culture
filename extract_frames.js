const { execSync } = require('child_process');
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  console.log('ffmpeg is installed');
} catch (e) {
  console.log('ffmpeg is NOT installed');
}
