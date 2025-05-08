const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src');

// Recursively walk through the directory
function walk(dir, fileList = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, fileList);
    } else if (/\.(jsx?|tsx?)$/.test(filepath)) {
      fileList.push(filepath);
    }
  });
  return fileList;
}

// Replace unescaped quotes and apostrophes inside JSX text content
function escapeEntities(content) {
  return content.replace(/>([^<]*?)</g, (match, text) => {
    const escaped = text
      .replace(/(?<!\\)"/g, '&quot;')
      .replace(/(?<!\\)'/g, '&apos;');
    return `>${escaped}<`;
  });
}

// Main logic
function run() {
  const files = walk(targetDir);

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = escapeEntities(content);

    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`✅ Escaped entities in: ${file}`);
    }
  });

  console.log('\n✨ Done! Re-run your build to verify.');
}

run();
