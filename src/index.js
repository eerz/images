const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = process.env.port || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Establish MongoDB connections
const dbConnections = [];
let dbs = {};

let i = 0;
while (process.env[`databaseToken${i}`]) {
  const dbConnectionUri = process.env[`databaseToken${i}`];

  const dbConnection = mongoose.createConnection(dbConnectionUri, {
    useNewUrlParser: false,
    useUnifiedTopology: false,
  });

  dbConnection.set("strictQuery", false);

  dbConnection.iam = `db${i}`;
  dbConnection.main = false;
  dbConnection.pos = i;

  console.log(dbConnection.iam, dbConnection.main);

  dbConnections.push(dbConnection);
  // allDbConnections.push(dbConnection);
  dbs[dbConnection.iam] = dbConnection;
  i++;
}

// Load functions and event handlers
const globe = {
  dbConnections: dbConnections,
  dbs: dbs,
  nextDb: dbConnections[0],
};

globe.secret = `780b5d02l619000aoxtmipz0gfwpx3g5v9ccghrxv5z4on2mhnfkz8t9ywqgtikonavm0slwrfeklubrcrl7nmofmgo5gasyqbv6udg6qkeiqn8blimttctkarcpr2rbvmqmddm46pqjepashmsv6mwa4wzojoivcussaidkkd9plndhha1uvocvzcpjb1pyrugjvkhlaupxolnrmwdpnodkqkorzmzdk7ix1uwge9nqddmt5qz0xmdduc4mrvn3`;

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(dbConnections, globe);
}

// Initialize event handlers
globe.handleEvent();
globe.handleMemories();

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// requiring all the v1 routes
require("./routes/v1/v1routes")(app, globe);

// extras
require("./routes/image")(app, globe);
require("./routes/v1/relational/getSimilar")(app, globe);
