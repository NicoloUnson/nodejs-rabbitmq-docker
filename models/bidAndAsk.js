const mongoose = require("mongoose");

let bidAndAskSchema = new mongoose.Schema({
    stock: { type:  mongoose.Schema.Types.ObjectId, ref:'mt_stocks'},
    bids: Object,
    asks: Object,
    time: String
}, {
    timestamps: true
})

module.exports = mongoose.model("mt_bid_ask", bidAndAskSchema);