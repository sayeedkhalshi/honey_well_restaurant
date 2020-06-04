const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
    offer1: {
        type: String,
        required: true,
    },
    offer2: {
        type: String,
        required: true,
    },
    offer3: {
        type: String,
        required: true,
    },
    offer4: {
        type: String,
        required: true,
    },
    offer5: {
        type: String,
        required: true,
    },
    offer6: {
        type: String,
        required: true,
    },
    offer7: {
        type: String,
        required: true,
    },
    offer8: {
        type: String,
        required: true,
    },
    offer9: {
        type: String,
        required: true,
    },
    offer10: {
        type: String,
        required: true,
    },
    offer11: {
        type: String,
        required: true,
    },
    offer12: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
});
module.exports = Hour = new mongoose.model("hours", HoursSchema);
