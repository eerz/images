const pako = require("pako");
const LZString = require("lz-string");

async function compressBuffer(buffer, globe) {
  // const compressedData = pako.deflate(buffer, { to: "string" });
  const compressedData = LZString.compressToBase64(buffer);
  return compressedData;
}

module.exports = { compressBuffer };
