const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TableSchema = new Schema({
    tablenumber: {
        type: String,
        required: true,
    },
    tablename: {
        type: String,
        required: true,
    },
    tableperson: {
        type: String,
        required: true,
    },
    tableimg: {
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
module.exports = Table = new mongoose.model("tables", TableSchema);
