const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('contact.html', 'utf8');

const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
let match;
const imgMatches = [];
while ((match = imgRegex.exec(content)) !== null) {
    imgMatches.push(match[1]);
}

console.log('Images in contact.html:', imgMatches);

imgMatches.forEach(src => {
    if (!src.endsWith('.webp')) throw new Error('Non webp image: ' + src);
    const p = path.join(__dirname, src);
    if (!fs.existsSync(p)) throw new Error('File missing: ' + src);
    const stat = fs.statSync(p);
    console.log(`${src} size: ${(stat.size / 1024).toFixed(1)} KB`);
    if (stat.size >= 90 * 1024) throw new Error('Image >= 90KB: ' + src);
});

if (!content.includes('https://www.google.com/maps/embed')) {
    throw new Error('Map iframe missing!');
}

console.log('ALL CHECKS PASSED FOR contact.html!');
