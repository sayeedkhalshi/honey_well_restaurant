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
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        //Status: pending, confirmed, halt, cancelled, served
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
});

module.exports = Reservation = new mongoose.model(
    "reservations",
    ReservationSchema
);
