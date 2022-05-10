const mongoose = require("mongoose");

let streamMessageSchema = new mongoose.Schema({
  symbol: {type: String, unique: true},
  data: {}
}, {
  timestamps: true
});

module.exports = mongoose.model("streammessage", streamMessageSchema);