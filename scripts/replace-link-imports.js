const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'src', 'app');
const oldImport = "import Link from 'next/link';";
const newImport = "import { LocaleLink as Link } from '@/i18n/locale-link';";

let updatedCount = 0;

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath);
        } else if (entry.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(oldImport)) {
                const newContent = content.split(oldImport).join(newImport);
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Updated:', path.relative(process.cwd(), fullPath));
                updatedCount++;
            }
        }
    }
}

walk(targetDir);
console.log(`\nDone. Updated ${updatedCount} files.`);
