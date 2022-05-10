const mongoose = require("mongoose");

let stockSchema = new mongoose.Schema({
  message: { type: Object}
}, {
  timestamps: true
});

module.exports = mongoose.model("StreamMessage", messageSchema);