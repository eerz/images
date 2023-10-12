const { PCA } = require("ml-pca");

const { getBuffer } = require("../../../exec/getBuffer");
const { getMany } = require("../../../exec/getMany");
const { createOne } = require("../../../exec/createOne");
const { generateId } = require("../../../exec/generateId");
const { getMatrix } = require("../../../exec/getMatrix");

// compression
const { compressBuffer } = require("../../../exec/compressor/compress");
const { decompressBuffer } = require("../../../exec/compressor/decompress");

module.exports = function (app, globe) {
  // Endpoint to check if a user exists
  app.post("/v1/relational/addElement/", async (req, res) => {
    const { url, qualities } = req.body;

    // get buffer of image
    const bufferBase64 = await getBuffer(url);
    if (!bufferBase64 || bufferBase64 === 401 || bufferBase64 === 500)
      return res.status(200).json({ response: 200, text: "no" });

    // get a set number of documents
    const schemaName = "generativeimages";
    const schema = globe.schemas.get(schemaName);
    const documents = await getMany(schemaName, schema, globe.limit, globe);

    // get the matrix of provided buffer
    const matrix = await getMatrix(documents, bufferBase64.buffer, globe);

    // compress the buffer
    const compressedBase64 = await compressBuffer(bufferBase64.buffer);
    console.log(typeof compressedBase64);

    // store in database
    const id = generateId();
    const query = {
      docId: id,
      matrix: matrix,
      buffer: compressedBase64,

      size: qualities?.size,
      height: qualities?.height,
      width: qualities?.width,

      fileType: bufferBase64.fileType,
    };

    console.log("successfully processed " + id);

    await createOne(query, schemaName, schema, globe);
    res.status(200).json({ response: 200, imageId: id });
  });
};
