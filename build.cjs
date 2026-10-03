const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'out');
fs.mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'style.css', 'main.js']) {
  fs.copyFileSync(path.join(__dirname, file), path.join(output, file));
}
fs.cpSync(path.join(__dirname, 'assets'), path.join(output, 'assets'), { recursive: true });
