const mongoose = require("mongoose");

let transaction_schema = new mongoose.Schema({
    symbol: String,
    transaction_number: Number,
    last_transacted_price: Number,
    last_transacted_volume: Number,
    last_transacted_value: Number,
    total_traded_volume: Number,
    total_traded_value: Number,
    price_vwap: Number,
    total_buy_transaction_volume: Number,
    total_sel_transaction_volume: Number,
    market_data_time: String,
    time_server: Date
}, {
    timestamps: true
})

module.exports = mongoose.model("mt_transactions", transaction_schema);