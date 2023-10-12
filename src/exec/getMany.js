async function getMany(schemaName, schema, limit, globe) {
  const { dbConnections } = globe;
  let toBreak = false;
  let num = 0;

  let docs = [];
  // query all databases to find the data
  for (const connection of dbConnections) {
    if (toBreak) break;
    console.log("rage");

    const docModel = connection.model(schemaName, schema);
    const queriedDocs = await docModel.find().limit(limit).lean();

    docs = [...docs, ...queriedDocs];
    if (docs.length >= limit) {
      toBreak = true;
      break;
    }

    // for (const doc of queriedDocs) {
    //   console.log(num++);
    //   docs.push(doc);
    // }
  }

  return docs;
}

module.exports = { getMany };
