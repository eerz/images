const pako = require("pako");
const LZString = require("lz-string");

function decompressBuffer(compressedString, globe) {
  // const decompressedData = pako.inflate(compressedString, { to: "string" });
  const decompressedString = LZString.decompressFromBase64(compressedString);
  return decompressedString;
}

module.exports = { decompressBuffer };
