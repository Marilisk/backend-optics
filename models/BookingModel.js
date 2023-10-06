import mongoose, {Schema} from "mongoose";

const BookingSchema = new Schema({
    roomNumber: {
        type: Number,
        required: true,
    },
    guest: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 1500,
    },
    daysOfReservation: {
        type: String,
    },
    startDate: {
        type: Number,
        required: true,
    },
     
}, 
{
    timestamps: true, 
}
);

export default mongoose.model('Booking', BookingSchema);