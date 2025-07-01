const mongoose = require("mongoose");

const rfidSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rfid: {
        type: String,
        required: true,
        sparse: true,
    }
}, {
    timestamps: true,
    
})

module.exports = mongoose.model("Rfid", rfidSchema);