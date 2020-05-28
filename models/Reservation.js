const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    combination: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
    },
    reserveddate: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    reservedhour: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    reservedtable: {
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
    pendingby: {
        type: Schema.Types.ObjectId,
    },
    specialby: {
        type: Schema.Types.ObjectId,
    },
    haltby: {
        type: Schema.Types.ObjectId,
    },
    cancelledby: {
        type: Schema.Types.ObjectId,
    },
    servedby: {
        type: Schema.Types.ObjectId,
    },
    confirmedby: {
        type: Schema.Types.ObjectId,
    },
    comment: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Reservation = new mongoose.model(
    "reservations",
    ReservationSchema
);
