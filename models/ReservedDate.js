const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DateSchema = new Schema({
    opendate: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        default: "future",
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },

    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = ReservedDate = new mongoose.model("reserveddates", DateSchema);
