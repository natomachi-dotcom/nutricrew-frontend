const fs = require("fs");
const path = require("path");

const appPath = "C:/Users/natom/OneDrive/Desktop/MILLIONAIRE HUSLE/CLAUDE/nutricrew-frontend/src/App.jsx";
const content = fs.readFileSync(appPath, "utf8");

// Find and extract the base64 data URI
const match = content.match(/src="data:image\/jpeg;base64,([^"]+)"/);
if (!match) { console.log("No base64 image found"); process.exit(1); }

const b64 = match[1];
const imgBuffer = Buffer.from(b64, "base64");
const outPath = "C:/Users/natom/OneDrive/Desktop/MILLIONAIRE HUSLE/CLAUDE/nutricrew-frontend/public/nutricrew-logo.jpg";
fs.writeFileSync(outPath, imgBuffer);
console.log(`Image extracted: ${imgBuffer.length} bytes -> ${outPath}`);

// Replace in App.jsx
const newContent = content.replace(/src="data:image\/jpeg;base64,[^"]+"/g, 'src="/nutricrew-logo.jpg"');
fs.writeFileSync(appPath, newContent, "utf8");
console.log("App.jsx updated: data URI replaced with /nutricrew-logo.jpg");
