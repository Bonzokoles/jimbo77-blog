const fs = require('fs');
const path = require('path');

const dir = 'U:\\The_yellow_hub\\AI_AGENT_SOCIAL_CLUB\\jimbo77-blog\\public\\blog-images';

fs.readdirSync(dir).forEach(file => {
    if (path.extname(file) === '.svg') {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Remove background rects
        // Matches <rect ... fill="url(#bgGrad)"/> or <rect ... fill="#..."/>
        const newContent = content.replace(/<rect[^>]+fill="(url\(#bgGrad\)|#[^"]+)"[^>]*\/>/g, '<!-- Background Removed -->');

        if (content !== newContent) {
            console.log(`Removing background from ${file}`);
            fs.writeFileSync(filePath, newContent);
        }
    }
});
