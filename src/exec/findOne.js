async function findOne(schemaName, schema, docId, globe) {
  const { dbConnections } = globe;
  let toBreak = false;
  let doc;

  // query all databases to find the data
  for (const connection of dbConnections) {
    if (toBreak) break;

    const docModel = connection.model(schemaName, schema);
    const queriedDoc = await docModel.findOne({ docId: docId });

    if (queriedDoc) {
      doc = queriedDoc;
      break;
    } else continue;
  }

  return doc ? { text: "yes", img: doc } : { text: "no" };
}

module.exports = { findOne };
