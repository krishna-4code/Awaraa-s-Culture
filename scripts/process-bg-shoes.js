const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'assets', 'bg elements');
const outDir = path.join(__dirname, '..', 'public', 'bg-shoes');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = [
  { in: 'OIP (1).svg', out: 'shoe-1.svg', w: 191, h: 191 },
  { in: 'OIP.svg', out: 'shoe-2.svg', w: 474, h: 474 },
  { in: 'il_1588xN.4685716618_in7g.svg', out: 'shoe-3.svg', w: 1588, h: 1270 },
  { in: 'il_fullxfull.3711415275_ogsr.svg', out: 'shoe-4.svg', w: 1555, h: 1167 },
  { in: 'il_fullxfull.4185765650_2a0i.svg', out: 'shoe-5.svg', w: 3000, h: 2409 }
];

files.forEach(f => {
  const filePath = path.join(srcDir, f.in);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ensure viewBox is present
  if (!content.includes('viewBox')) {
    content = content.replace(/<svg([^>]*)width="([^"]*)" height="([^"]*)"/i, `<svg$1width="$2" height="$3" viewBox="0 0 ${f.w} ${f.h}"`);
  }
  
  // Split into lines and filter out any full canvas background paths
  const lines = content.split('\n');
  const filteredLines = lines.filter((line, index) => {
    // If it's the first path element and covers 0 0 ... 191/474/1588/etc with solid white/grey fill
    if (index === 2 && line.trim().startsWith('<path') && (line.includes('fill="#FEFEFE"') || line.includes('fill="#F8F7F7"'))) {
      return false;
    }
    return true;
  });
  
  const destPath = path.join(outDir, f.out);
  fs.writeFileSync(destPath, filteredLines.join('\n'), 'utf8');
  console.log(`Saved ${f.out} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB) without background rect`);
});
