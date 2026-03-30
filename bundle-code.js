import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_FILE = 'kiyota_project_code.txt';
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'public', 'dist', '.vercel', '.cursor'];
const IGNORE_FILES = [OUTPUT_FILE, 'package-lock.json', 'yarn.lock', '.DS_Store', 'favicon.ico', 'bundle-code.js'];
const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.sql'];

const outputStream = fs.createWriteStream(path.join(__dirname, OUTPUT_FILE));

function bundleFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const relativePath = path.relative(__dirname, filePath);

        if (stats.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                bundleFiles(filePath);
            }
        } else {
            const ext = path.extname(file);
            if (ALLOWED_EXTENSIONS.includes(ext) && !IGNORE_FILES.includes(file)) {
                outputStream.write(`\n--- START FILE: ${relativePath} ---\n`);
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    outputStream.write(content);
                } catch (err) {
                    outputStream.write(`// Error reading file: ${err.message}\n`);
                }
                outputStream.write(`\n--- END FILE: ${relativePath} ---\n`);
            }
        }
    });
}

console.log('🚀 Starting Kiyota Project Bundle process...');
outputStream.write(`KIYOTA PROJECT EXPORT - DATE: ${new Date().toISOString()}\n`);
outputStream.write(`====================================================\n`);

try {
    bundleFiles(__dirname);
    outputStream.end();
} catch (error) {
    console.error('❌ Error during bundling:', error);
}

outputStream.on('finish', () => {
    console.log(`✅ Success! All code exported to: ${OUTPUT_FILE}`);
    console.log('Please upload this file for analysis.');
});