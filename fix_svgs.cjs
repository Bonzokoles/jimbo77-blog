const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDir = process.argv[2] || '.';

walk(targetDir, (filePath) => {
    if (filePath.endsWith('.svg')) {
        const content = fs.readFileSync(filePath, 'utf8');
        // Regex to find & not followed by amp;, lt;, gt;, apos;, quot;
        const regex = /&(?!(amp|lt|gt|apos|quot);)/g;

        if (regex.test(content)) {
            console.log(`Fixing: ${filePath}`);
            const fixedContent = content.replace(regex, '&amp;');
            fs.writeFileSync(filePath, fixedContent, 'utf8');
        }
    }
});
