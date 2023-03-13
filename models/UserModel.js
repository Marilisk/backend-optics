import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, },
    fullName: { type: String, required: true, },
    password: { type: String, required: true,  },
    activationLink: { type: String },
    role: {type: String, default: 'USER',},
    isActivated: { type: Boolean, default: false, },
    avatarUrl: String,  //здесь пишет только тип, потому что других параметров нет
    cart: [],
    favourites: [],
    orders: {type: Array, default: []},
}, 
{
    timestamps: true, // прикручием дату создания и обновления сущности
});

export default mongoose.model('User', UserSchema);