// scripts/extractMarkdownStyles.js
import fs from 'fs';
import path from 'path';

const inputPath = path.join(process.cwd(), 'components/utils.module.css');
const outputPath = path.join(process.cwd(), 'styles/markdown.css');

const usedClasses = ['paragraph', 'list', 'listItem', 'heading', 'quote'];
const prefix = 'markdown-';

const css = fs.readFileSync(inputPath, 'utf-8');

let extracted = '';

for (const className of usedClasses) {
  const regex = new RegExp(`\\.${className}\\s*{[^}]+}`, 'g');
  const match = css.match(regex);
  if (match) {
    extracted += match
      .join('\n\n')
      .replace(new RegExp(`\\.${className}`, 'g'), `.${prefix}${className}`) + '\n\n';
  } else {
    console.warn(`⚠️ Class .${className} not found in CSS`);
  }
}

fs.writeFileSync(outputPath, extracted.trim());
console.log(`✅ Created: ${outputPath}`);
