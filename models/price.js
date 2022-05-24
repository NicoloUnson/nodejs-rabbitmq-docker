const mongoose = require("mongoose");

let priceSchema = new mongoose.Schema({
    stock: { type:  mongoose.Schema.Types.ObjectId, ref:'mt_stocks'},
    previous_day_closing_price: Number,
    adjusted_previous_day_closing_price: Number,
    open_price: Number,
    highest_price: Number,
    lowest_price: Number,
    last_transacted_price: Number,
    price_vwap: Number,
    floor_price: Number,
    ceiling_price: Number,
    strike_price: Number,
    fiftytwo_week_high: Number,
    fiftytwo_week_low: Number,
    value: Number
}, {
    timestamps: true
})

module.exports = mongoose.model("mt_price", priceSchema);