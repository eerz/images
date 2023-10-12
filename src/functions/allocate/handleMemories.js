const imageSchema = require("../../../data/images");

module.exports = (dbConnections, globe) => {
  globe.handleMemories = async () => {
    globe.schemas = new Map();
    globe.schemas.set("generativeimages", imageSchema);

    globe.limit = 1000;

    globe.consider =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    globe.pool = [];
  };
};
