const { Schema } = require("mongoose");

module.exports = new Schema({
  docId: String,
  matrix: [Number],

  buffer: String,

  size: Number,
  height: Number,
  width: Number,

  fileType: String,
});
