import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, },
    fullName: { type: String, required: true, },
    password: { type: String, required: true,  },
    activationLink: { type: String },
    resetPasswordLink: { type: String },
    role: {type: String, default: 'USER',},
    isActivated: { type: Boolean, default: false, },
    allowedToResetPassword: { type: Boolean },
    avatarUrl: String,  
    cart: [],
    favourites: [],
    orders: {type: Array, default: []},
}, 
{
    timestamps: true, 
});

export default mongoose.model('User', UserSchema);