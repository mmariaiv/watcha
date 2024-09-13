const mongoose = require("mongoose");


const roomSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    createdtime: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model("room", roomSchema);
