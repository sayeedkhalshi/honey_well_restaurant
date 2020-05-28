const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DateSchema = new Schema({
    opendate: {
        type: String,
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = ReservedDate = new mongoose.model("reserveddates", DateSchema);
