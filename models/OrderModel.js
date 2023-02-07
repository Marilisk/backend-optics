import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    cart: Array,
    address: { type: String, default: ''},
    phoneNumber: { type: String, /* required: true, */ },
    paymentMade: { type: Boolean, required: true, default: false,},
    paymentWay: { type: String, required: true, default: 'cash', },
    userId: {type: String, required: true,},
    condition: {type: String, default: 'order created',},
    additionalInfo: {type: String, },
}, 
{
    timestamps: true, // прикручием дату создания и обновления сущности
});

export default mongoose.model('Order', OrderSchema);