const fs = require("fs");
const mongoose = require("mongoose");

module.exports = (dbConnections, globe) => {
  globe.handleEvent = async () => {
    dbConnections.forEach((dbConnection) => {
      const eventFolder = fs.readdirSync(`./src/events`);
      const eventTargetMap = {
        mongo: dbConnection,
      };

      for (const folder of eventFolder) {
        const eventFiles = fs
          .readdirSync(`./src/events/${folder}`)
          .filter((file) => file.endsWith(".js"));

        const eventTarget = eventTargetMap[folder];

        for (const file of eventFiles) {
          const event = require(`../../events/${folder}/${file}`);
          if (event.once) {
            eventTarget.once(
              event.name,
              (...args) => event.execute(...args, dbConnection) // Pass the dbConnection instead of the client
            );
          } else {
            eventTarget.on(event.name, (...args) => {
              event.execute(...args, dbConnection); // Pass the dbConnection instead of the client
            });
          }
        }
      }
    });
  };
};
