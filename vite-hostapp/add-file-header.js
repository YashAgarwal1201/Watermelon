#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = process.argv[2] || process.cwd();
const exts = [".js", ".jsx", ".ts", ".tsx", ".vue"];

function getComment(pathname) {
  if (pathname.endsWith(".vue")) {
    return `// File: ${pathname}`;
  }
  return `// File: ${pathname}`;
}

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else {
      callback(filepath);
    }
  });
}

walk(rootDir, (filePath) => {
  if (exts.includes(path.extname(filePath))) {
    const relPath = path.relative(rootDir, filePath);
    const commentLine = getComment(relPath);

    let content = fs.readFileSync(filePath, "utf8");

    if (!content.startsWith("// File:")) {
      content = commentLine + "\n\n" + content;
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✔ Added header to ${relPath}`);
    }
  }
});
