const mongoose = require("mongoose");

let volumeSchema = new mongoose.Schema({
    stock: { type:  mongoose.Schema.Types.ObjectId, ref:'mt_stocks'},
    last_transacted_volume: Number,
    total_traded_volume: Number,
    total_sell_transaction_volume: Number,
    total_buy_transaction_volume: Number
}, {
    timestamps: true
})

module.exports = mongoose.model("mt_volume", volumeSchema);