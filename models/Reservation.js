const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    reserveddate: {
        type: String,
        required: true,
    },
    reservedhour: {
        type: String,
        required: true,
    },
    reservedtable: {
        type: String,
        required: true,
    },
    reservedby: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

module.exports = Reservation = new mongoose.model(
    "reservations",
    ReservationSchema
);
