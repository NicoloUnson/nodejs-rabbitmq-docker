const mongoose = require("mongoose");

let kline = new mongoose.Schema({
  symbol: String,
  open_price: Number,
  close_price: Number,
  high_price: Number,
  low_price:  Number,
  time: Date
}, {
  timestamps: true
});

module.exports = mongoose.model("mt_kline", kline);