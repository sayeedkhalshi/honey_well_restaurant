const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 80,
        min: 2,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    },
    addedby: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
});
module.exports = User = new mongoose.model("users", UserSchema);
