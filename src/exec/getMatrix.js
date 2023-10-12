const { PCA } = require("ml-pca");

// compression
const { compressBuffer } = require("./compressor/compress");
const { decompressBuffer } = require("./compressor/decompress");

async function getMatrix(documents, buffer, globe) {
  const charactersToConsider = globe.consider;

  // compare and get new matrix
  const newdocuments = [];
  for (const doc of documents) {
    const decompressedBase64 = decompressBuffer(doc.buffer, globe);
    newdocuments.push(decompressedBase64);
  }

  const documentBuffers = [...newdocuments, buffer];

  const promises = documentBuffers.map(async (document) => {
    return countCharacters(document, charactersToConsider);
  });

  const characterCounts = await Promise.all(promises);

  // const characterCounts = documentBuffers.map((document) => {
  //   const counts = {};

  //   for (const char of charactersToConsider) {
  //     counts[char] = 0; // Initialize count for this character

  //     for (const docChar of document) {
  //       if (docChar === char) {
  //         counts[char]++; // Increment count when a matching character is found
  //       }
  //     }
  //   }

  //   return counts;
  // });

  const normalizedCharacterCounts = characterCounts.map((counts) =>
    Object.values(counts).map(
      (val) =>
        val /
        Math.sqrt(
          Object.values(counts).reduce((acc, cur) => acc + cur * cur, 0)
        )
    )
  );

  const pca = new PCA(normalizedCharacterCounts);
  const embeddedDocuments = pca.predict(normalizedCharacterCounts, {
    nComponents: 3,
  });

  const extractedData = await matrixExtraction(embeddedDocuments);
  return extractedData[extractedData.length - 1];
}

async function matrixExtraction(embeddedDocuments) {
  const matrix = embeddedDocuments;

  const numRows = matrix.rows; // Get the number of rows
  const numCols = matrix.columns; // Get the number of columns

  const rowsAsArrays = [];

  for (let i = 0; i < numRows; i++) {
    const row = [];
    for (let j = 0; j < numCols; j++) {
      const element = matrix.get(i, j); // Access the element at the current row and column
      row.push(element);
    }
    rowsAsArrays.push(row);
  }

  return rowsAsArrays;
}

module.exports = { getMatrix };

function countCharacters(document, charactersToConsider) {
  const counts = {};

  for (const char of charactersToConsider) {
    counts[char] = 0; // Initialize count for this character
  }

  for (let i = 0; i < document.length; i++) {
    const char = document[i];
    counts[char]++; // Increment count when a matching character is found
  }

  return counts;
}
