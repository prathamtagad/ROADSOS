const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Support .mbtiles assets for offline maps
config.resolver.assetExts.push("mbtiles");

// Monorepo workspace setup — resolve hoisted node_modules
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];



module.exports = config;
