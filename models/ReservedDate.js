const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DateSchema = new Schema({
    reserveddate: {
        type: String,
        required: true,
    },
    closed: [
        {
            type: Boolean,
        },
        {
            user: {
                type: Schema.Types.ObjectId,
                required: true,
            },
        },
    ],
});

module.exports = ReservedDate = new mongoose.model("reserveddate", DateSchema);
