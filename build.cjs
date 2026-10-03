const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'dist');
fs.mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'style.css', 'main.js']) {
  fs.copyFileSync(path.join(__dirname, file), path.join(output, file));
}
fs.cpSync(path.join(__dirname, 'ezgif-8fcc76cbd7cc975c-jpg'), path.join(output, 'ezgif-8fcc76cbd7cc975c-jpg'), { recursive: true });
