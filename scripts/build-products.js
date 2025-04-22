const fs = require('fs');
const path = require('path');
const { marked } = require('marked');  // Import marked
const { products } = require('../data/products');  // Your raw products data

const renderer = new marked.Renderer();

renderer.paragraph = (text) => `<p class="markdown-paragraph">${text}</p>`;
renderer.list = (body) => `<ul class="markdown-list">${body}</ul>`;
renderer.listitem = (text) => `<li class="markdown-list-item">${text}</li>`;
renderer.heading = (text, level) => {
  if (level === 3) return `<h3 class="markdown-heading">${text}</h3>`;
  return `<h${level}>${text}</h${level}>`;
};
renderer.blockquote = (quote) => `<blockquote class="markdown-quote">${quote}</blockquote>`;

// Convert markdown to HTML using marked
function markdownToHtml(md) {
  if (!md || md.trim() === '') {
    console.warn("Empty or invalid markdown received");
    return '';  // Return empty if invalid
  }
  return marked(md);  // Convert markdown to HTML
}

async function build() {
  const byId = {};

  for (const p of products) {
    try {
      if (!p.description || p.description.trim() === '') {
        console.warn(`Product ${p.id} has no description`);
      }

      byId[p.id] = {
        ...p,  // Retain other product properties
        descriptionHtml: markdownToHtml(p.description)  // Convert description to HTML
      };

    } catch (error) {
      console.error(`Error processing product ${p.id}:`, error);
    }
  }

  const outPath = path.resolve(process.cwd(), 'data', 'products-by-id.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(byId, null, 2));  // Write to file
  console.log(`👉 Built ${Object.keys(byId).length} products → ${outPath}`);
}

build().catch((e) => {
  console.error("Build failed:", e);
  process.exit(1);
});
