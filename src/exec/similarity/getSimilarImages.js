const KDTree = require("kd-tree-javascript");

const { getBuffer } = require("../getBuffer");
const { getMany } = require("../getMany");
const { getMatrix } = require("../getMatrix");

async function getSimilarImages(query, globe) {
  const url = query.url;

  // get buffer of image
  const bufferBase64 = await getBuffer(url);
  console.log(bufferBase64);
  if (!bufferBase64 || bufferBase64 === 401 || bufferBase64 === 500) return 404;

  // get a set number of documents
  const schemaName = "generativeimages";
  const schema = globe.schemas.get(schemaName);
  const documents = await getMany(schemaName, schema, globe.limit, globe);

  // get the matrix of provided buffer
  const matrix = await getMatrix(documents, bufferBase64.buffer, globe);

  // // Build a KD-Tree from the embedded representations of your documents
  // const tree = new KDTree(
  //   documents.map((doc) => doc.matrix),
  //   (a, b) => {
  //     return Math.sqrt(
  //       a.reduce((acc, val, idx) => acc + (val - b[idx]) ** 2, 0)
  //     );
  //   }
  // );

  // // Perform nearest neighbor search
  // const nearestNeighbors = tree.nearest(matrix, 10); // Retrieve the top 5 nearest neighbors

  // // Create an array of objects with document text and similarity score
  // const similarDocuments = nearestNeighbors.map((result) => {
  //   const docIndex = result[1];
  //   const similarityScore = result[0];
  //   return { text: documents[docIndex].docId, similarity: similarityScore };
  // });

  // Calculate distances and sort by distance
  const distances = documents.map((doc) => ({
    document: doc.docId,
    distance: Math.sqrt(
      doc.matrix.reduce((acc, val, idx) => acc + (val - matrix[idx]) ** 2, 0)
    ),
  }));

  // Sort by distance in ascending order
  distances.sort((a, b) => a.distance - b.distance);

  // Return the top N similar documents
  const topN = 5; // Adjust the number as needed
  const similarDocuments = distances.slice(0, topN).map((doc) => ({
    docId: doc.document,
    similarity: doc?.similarityScore,
  }));
  console.log(similarDocuments);
}

module.exports = { getSimilarImages };
