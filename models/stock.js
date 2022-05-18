const mongoose = require("mongoose");

let stockSchema = new mongoose.Schema({
    symbol: {type:String, unique: true},
    short_name: String,
    full_name: String,
    isin: String,
}, {
    timestamps: true
})

module.exports = mongoose.model("mt_stocks", stockSchema);