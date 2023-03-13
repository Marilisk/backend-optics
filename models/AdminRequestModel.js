import mongoose from "mongoose";

const AdminRequestModelSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, },
    fullName: { type: String, required: true, },
    isAnswered: {type: Boolean},
    role: {type: String, }
},
    {
        timestamps: true, // прикручием дату создания и обновления сущности
    });

export default mongoose.model('AdminRequestModel', AdminRequestModelSchema);