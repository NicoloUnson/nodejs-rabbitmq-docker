const mongoose = require("mongoose");

let eodStockSchema = new mongoose.Schema({
    stock: { type:  mongoose.Schema.Types.ObjectId, ref:'mt_stocks'},
    prices: {
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
    },
    volumes: {
        last_transacted_volume: Number,
        total_traded_volume: Number,
        total_sell_transaction_volume: Number,
        total_buy_transaction_volume: Number
    },
    date: Date
}, {
    timestamps: true
})

module.exports = mongoose.model("mt_eod_stock_data", eodStockSchema);