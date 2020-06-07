const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ForgetPassSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    forgot: {
        type: String,
    },

    expire_at: {
        type: Date,
        default: Date.now,
        expires: 7200,
    },
});

module.exports = ForgetPass = new mongoose.model(
    "forgetpasses",
    ForgetPassSchema
);
