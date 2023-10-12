const {
  getSimilarImages,
} = require("../../../exec/similarity/getSimilarImages");

module.exports = function (app, globe) {
  // Endpoint to check if a user exists
  app.post("/v1/relational/getSimilar/", async (req, res) => {
    const similars = await getSimilarImages(req.body, globe);

    res.status(200).json({ response: 200, similars });
  });
};
