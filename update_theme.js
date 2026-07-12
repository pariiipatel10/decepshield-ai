const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'FRONTEND', 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Backgrounds
    content = content.replace(/bg-\[var\(--color-dark-bg\)\]/g, 'bg-[var(--color-bg-base)]');
    content = content.replace(/bg-\[#0a0a0f\]/g, 'bg-[var(--color-bg-base)]');
    content = content.replace(/bg-\[rgba\(0,0,0,0\.3\)\]/g, 'bg-[var(--color-bg-card)]');
    content = content.replace(/bg-\[rgba\(0,0,0,0\.2\)\]/g, 'bg-[var(--color-bg-card)]');
    content = content.replace(/bg-\[rgba\(255,255,255,0\.05\)\]/g, 'bg-[var(--color-bg-hover)]');
    content = content.replace(/hover:bg-\[rgba\(255,255,255,0\.05\)\]/g, 'hover:bg-[var(--color-bg-hover)]');
    content = content.replace(/hover:bg-\[rgba\(255,255,255,0\.03\)\]/g, 'hover:bg-[var(--color-bg-hover)]');
    content = content.replace(/bg-\[rgba\(255,255,255,0\.1\)\]/g, 'bg-[var(--color-bg-active)]');
    content = content.replace(/hover:bg-\[rgba\(255,255,255,0\.2\)\]/g, 'hover:bg-[var(--color-bg-active-hover)]');
    
    // Text
    content = content.replace(/text-white/g, 'text-[var(--color-text-main)]');
    content = content.replace(/text-\[var\(--color-text-secondary\)\]/g, 'text-[var(--color-text-muted)]');
    
    // Borders
    content = content.replace(/border-\[var\(--color-glass-border\)\]/g, 'border-[var(--color-border-glass)]');
    content = content.replace(/border-\[rgba\(255,255,255,0\.05\)\]/g, 'border-[var(--color-border-glass)]');
    content = content.replace(/border-\[rgba\(255,255,255,0\.1\)\]/g, 'border-[var(--color-border-glass)]');
    content = content.replace(/border-\[rgba\(255,255,255,0\.02\)\]/g, 'border-[var(--color-border-glass)]');
    
    // Primary Color (Pink) -> rgba(255,42,133
    content = content.replace(/text-\[var\(--color-neon-blue\)\]/g, 'text-[var(--color-primary)]');
    content = content.replace(/border-t-\[var\(--color-neon-blue\)\]/g, 'border-t-[var(--color-primary)]');
    content = content.replace(/border-l-\[var\(--color-neon-blue\)\]/g, 'border-l-[var(--color-primary)]');
    content = content.replace(/neon-border-blue/g, 'custom-shadow-primary');
    content = content.replace(/neon-text-blue/g, 'custom-text-shadow-primary');
    content = content.replace(/bg-\[var\(--color-neon-blue\)\]/g, 'bg-[var(--color-primary)]');
    
    content = content.replace(/bg-\[rgba\(255,42,133,0\.05\)\]/g, 'bg-[var(--color-primary-alpha-5)]');
    content = content.replace(/bg-\[rgba\(255,42,133,0\.1\)\]/g, 'bg-[var(--color-primary-alpha-10)]');
    content = content.replace(/bg-\[rgba\(255,42,133,0\.2\)\]/g, 'bg-[var(--color-primary-alpha-20)]');
    content = content.replace(/hover:bg-\[rgba\(255,42,133,0\.2\)\]/g, 'hover:bg-[var(--color-primary-alpha-20)]');
    content = content.replace(/border-\[rgba\(255,42,133,0\.3\)\]/g, 'border-[var(--color-primary-alpha-30)]');
    content = content.replace(/border-\[rgba\(255,42,133,0\.4\)\]/g, 'border-[var(--color-primary-alpha-40)]');
    content = content.replace(/border-\[rgba\(255,42,133,0\.5\)\]/g, 'border-[var(--color-primary-alpha-50)]');
    
    // Secondary Color (Purple) -> rgba(255,0,255
    content = content.replace(/text-\[var\(--color-neon-purple\)\]/g, 'text-[var(--color-secondary)]');
    content = content.replace(/border-t-\[var\(--color-neon-purple\)\]/g, 'border-t-[var(--color-secondary)]');
    content = content.replace(/bg-\[var\(--color-neon-purple\)\]/g, 'bg-[var(--color-secondary)]');
    
    content = content.replace(/bg-\[rgba\(255,0,255,0\.05\)\]/g, 'bg-[var(--color-secondary-alpha-5)]');
    content = content.replace(/bg-\[rgba\(255,0,255,0\.1\)\]/g, 'bg-[var(--color-secondary-alpha-10)]');
    content = content.replace(/bg-\[rgba\(255,0,255,0\.2\)\]/g, 'bg-[var(--color-secondary-alpha-20)]');
    content = content.replace(/hover:bg-\[rgba\(255,0,255,0\.2\)\]/g, 'hover:bg-[var(--color-secondary-alpha-20)]');
    content = content.replace(/border-\[rgba\(255,0,255,0\.3\)\]/g, 'border-[var(--color-secondary-alpha-30)]');
    content = content.replace(/border-\[rgba\(255,0,255,0\.5\)\]/g, 'border-[var(--color-secondary-alpha-50)]');
    
    // Tertiary (Orange) / Red -> Let's just leave red classes as Tailwind native, or map them. 
    // The user asked for pink orange purple mixture. We can replace Tailwind red/orange classes with our tertiary.
    content = content.replace(/text-red-400/g, 'text-[var(--color-tertiary)]');
    content = content.replace(/bg-red-400\/10/g, 'bg-[var(--color-tertiary-alpha-10)]');
    content = content.replace(/border-red-400\/20/g, 'border-[var(--color-tertiary-alpha-20)]');
    content = content.replace(/border-red-400\/30/g, 'border-[var(--color-tertiary-alpha-30)]');
    content = content.replace(/bg-red-500\/10/g, 'bg-[var(--color-tertiary-alpha-10)]');
    content = content.replace(/border-red-500\/30/g, 'border-[var(--color-tertiary-alpha-30)]');
    content = content.replace(/hover:bg-red-500\/20/g, 'hover:bg-[var(--color-tertiary-alpha-20)]');
    content = content.replace(/border-t-red-500/g, 'border-t-[var(--color-tertiary)]');
    content = content.replace(/bg-red-400/g, 'bg-[var(--color-tertiary)]');
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Update complete');
