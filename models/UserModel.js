import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,  //здесь пишет только тип, потому что других параметров нет
}, 
{
    timestamps: true, // прикручием дату создания и обновления сущности
});

export default mongoose.model('User', UserSchema);