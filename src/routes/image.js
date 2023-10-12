const { findOne } = require("../exec/findOne");

// compression
const { decompressBuffer } = require("../exec/compressor/decompress");

module.exports = function (app, globe) {
  // Endpoint to check if a user exists
  app.get("/image/:id", async (req, res) => {
    const imageId = req.params.id;

    // try getting the document from database
    const schemaName = "generativeimages";
    const schema = globe.schemas.get(schemaName);
    const doc = await findOne(schemaName, schema, imageId, globe);

    // return if image not found
    if (doc.text === "no") return res.status(404).send("Image not found");

    // Decompress buffer and get the image buffer
    const compressedBuffer = doc.img.buffer; // Assuming doc.img.buffer contains the compressed image
    const base64Buffer = await decompressBuffer(compressedBuffer, globe);
    const buffer = Buffer.from(base64Buffer, "base64");

    res.setHeader("Content-Type", "image/jpeg");
    res.send(buffer);
  });
};
