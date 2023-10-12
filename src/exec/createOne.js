async function createOne(query, schemaName, schema, globe) {
  // destructure data
  const { nextDb } = globe;

  // store the data in the nextDb
  const docModel = nextDb.model(schemaName, schema);
  doc = await docModel.create(query);

  // set new next db at the end of execution
  newNextDb(globe);
  return doc;
}

module.exports = { createOne };

function newNextDb(globe) {
  const { dbConnections, nextDb } = globe;
  // if it has reached the end of the array
  if (nextDb.pos === dbConnections.length - 1) {
    globe.nextDb = dbConnections[0];
    return;
  }

  // set it as the next db
  globe.nextDb = dbConnections[nextDb.pos + 1];
}

function getRandomMainDb(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
