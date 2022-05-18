const mongoose = require("mongoose");

let stream_messages = new mongoose.Schema({
    symbol: {type:String},
    data: {}
}, {
    timestamps: true
})

module.exports = mongoose.model("mt_messages", stream_messages);