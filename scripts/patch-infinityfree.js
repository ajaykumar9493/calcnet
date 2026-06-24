/**
 * InfinityFree and some hosts block or skip the `_next` folder.
 * Rename to `assets` and rewrite all references in the static export.
 */
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "out");
const OLD_PREFIX = "/_next/";
const NEW_PREFIX = "/assets/";
const OLD_DIR = "_next";
const NEW_DIR = "assets";

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, callback);
    else callback(full);
  }
}

function replaceInFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".html", ".js", ".css", ".json", ".txt"].includes(ext)) return;

  let content = fs.readFileSync(filePath, "utf8");
  const updated = content
    .replaceAll(OLD_PREFIX, NEW_PREFIX)
    .replaceAll("_next/", "assets/")
    .replaceAll('"_next', '"assets')
    .replaceAll("'_next", "'assets");

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("Updated:", path.relative(OUT_DIR, filePath));
  }
}

const oldPath = path.join(OUT_DIR, OLD_DIR);
const newPath = path.join(OUT_DIR, NEW_DIR);

if (!fs.existsSync(oldPath)) {
  console.error("Missing out/_next — run npm run build first.");
  process.exit(1);
}

if (fs.existsSync(newPath)) {
  fs.rmSync(newPath, { recursive: true, force: true });
}

fs.renameSync(oldPath, newPath);
console.log(`Renamed ${OLD_DIR}/ → ${NEW_DIR}/`);

walk(OUT_DIR, replaceInFile);
console.log("Static export patched for InfinityFree.");

// Create deploy.zip for easy upload to InfinityFree File Manager
const { execSync } = require("child_process");
const zipPath = path.join(__dirname, "..", "calcnet-deploy.zip");
try {
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  if (process.platform === "win32") {
    execSync(
      `powershell -Command "Compress-Archive -Path '${OUT_DIR}\\*' -DestinationPath '${zipPath}' -Force"`,
      { stdio: "inherit" }
    );
  } else {
    execSync(`cd "${OUT_DIR}" && zip -r "${zipPath}" .`, { stdio: "inherit" });
  }
  console.log(`Created: ${zipPath}`);
  console.log("Upload this ZIP to InfinityFree htdocs and EXTRACT it there.");
} catch (e) {
  console.warn("Could not create zip:", e.message);
}
