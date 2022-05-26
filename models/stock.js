const mongoose = require("mongoose");

let stockSchema = new mongoose.Schema({
    symbol: {type:String, unique: true},
    short_name: String,
    full_name: String,
    isin: String,
    high_price: Number,
    low_price: Number,
    open_price: Number,
    curr_price: Number,
    price_change: Number,
    fiftytwo_week_high: Number,
    fiftytwo_week_low: Number,
    market_cap: Number,
    volume: Number,
    trades: Number
}, {
    timestamps: true
})

module.exports = mongoose.model("mt_stocks", stockSchema);