const mongoose = require("mongoose");

let priceSchema = new mongoose.Schema({
    stock: { type:  mongoose.Schema.Types.ObjectId, ref:'mt_stocks'},
    previous_day_closing_price: String,
    adjusted_previous_day_closing_price: String,
    open_price: String,
    highest_price: String,
    lowest_price: String,
    last_transacted_price: String,
    price_vwap: String,
    floor_price: String,
    ceiling_price: String,
    strike_price: String,
    fiftytwo_week_high: String,
    fiftytwo_week_low: String
}, {
    timestamps: true
})

module.exports = mongoose.model("mt_price", priceSchema);