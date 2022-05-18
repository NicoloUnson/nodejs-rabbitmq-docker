const mongoose = require("mongoose");

let index = new mongoose.Schema({
  symbol: { type: String},
  name: {type: String},
  close_price: {type: String},
  open_price: {type: String},
  high_price: {type: String},
  low_price:  {type: String},
  price: {type: String},
  datetime: {type: Date}
}, {
  timestamps: true
});

module.exports = mongoose.model("indices", index);