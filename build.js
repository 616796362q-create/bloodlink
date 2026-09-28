import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Bulletproof Vercel Build Script...');

const isRoot = fs.existsSync(path.join(process.cwd(), 'frontend'));

if (isRoot) {
  console.log('📁 Detected Root Directory: Building frontend submodule...');
  execSync('npm install --prefix frontend && npm run build --prefix frontend', { stdio: 'inherit' });
  
  // Copy frontend/dist to root dist if needed
  if (fs.existsSync(path.join(process.cwd(), 'frontend', 'dist'))) {
    if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
      fs.mkdirSync(path.join(process.cwd(), 'dist'), { recursive: true });
    }
    fs.cpSync(path.join(process.cwd(), 'frontend', 'dist'), path.join(process.cwd(), 'dist'), { recursive: true });
    console.log('✅ Copied frontend/dist to root dist successfully.');
  }
} else {
  console.log('📁 Detected Frontend Subdirectory: Running direct vite build...');
  execSync('npm run build', { stdio: 'inherit' });
}

console.log('🎉 Build completed successfully with 0 errors!');
