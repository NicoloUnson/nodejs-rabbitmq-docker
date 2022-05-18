const mongoose = require("mongoose");

let volumeSchema = new mongoose.Schema({
    stock: { type:  mongoose.Schema.Types.ObjectId, ref:'mt_stocks'},
    last_transacted_volume: String,
    total_traded_volume: String,
    total_sell_transaction_volume: String,
    total_buy_transaction_volume: String
}, {
    timestamps: true
})

module.exports = mongoose.model("mt_volume", volumeSchema);