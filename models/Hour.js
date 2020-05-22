const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HoursSchema = new Schema({
    openhour: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});
module.exports = Hour = new mongoose.model("hours", HoursSchema);
