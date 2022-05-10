const mongoose = require("mongoose");

let indexSchema = new mongoose.Schema({
  message: { type: Object}
}, {
  timestamps: true
});

module.exports = mongoose.model("indices", indexSchema);