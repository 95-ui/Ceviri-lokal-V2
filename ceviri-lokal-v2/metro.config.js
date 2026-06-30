const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Allow HTML files to be bundled as assets
config.resolver.assetExts = [...config.resolver.assetExts, "html"];

module.exports = config;
