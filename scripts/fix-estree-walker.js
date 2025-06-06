#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function fixEstreeWalker() {
  const packagePath = path.join(
    __dirname,
    "..",
    "node_modules",
    "nuxt",
    "node_modules",
    "estree-walker",
    "package.json"
  );

  if (!fs.existsSync(packagePath)) {
    console.log(
      "✅ estree-walker in nuxt/node_modules not found, skipping fix"
    );
    return;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

    // Check if fix is needed
    if (
      packageJson.exports &&
      packageJson.exports["."] &&
      packageJson.exports["."].require
    ) {
      console.log("✅ estree-walker already fixed");
      return;
    }

    // Apply fix
    packageJson.main = "./src/index.js";
    if (packageJson.exports && packageJson.exports["."]) {
      packageJson.exports["."].require = "./src/index.js";
      packageJson.exports["."].default = "./src/index.js";
    }

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, "\t"));
    console.log("🔧 Fixed estree-walker exports in nuxt/node_modules");
  } catch (error) {
    console.error("❌ Failed to fix estree-walker:", error.message);
  }
}

fixEstreeWalker();
