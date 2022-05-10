const mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
  symbol: { type: String},
  name: {type: String},
  short_name: {type: String},
  price_change: {type: String},
  open_price: {type: String},
  high_price: {type: String},
  low_price:  {type: String},
  price_change: {type: String},
  price: {type: String},
  volume: {type: String},
  fiftytwo_week_high: {type: String},
  traded_volume: {type: String},
  datetime: {type: Date}
}, {
  timestamps: true
});

module.exports = mongoose.model("newmarkets", messageSchema);