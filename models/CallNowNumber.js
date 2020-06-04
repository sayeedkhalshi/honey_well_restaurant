const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CallNowSchema = new Schema({
    callnownumber: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
});
module.exports = CallNow = new mongoose.model("callnow", CallNowSchema);
