import mongoose from "mongoose";

const LensSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        default: 'Lenses',
    },
    brand: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    manufacturerCountry: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    
    price: {
        type: Number,
        required: true,
    },
   
    prescription: {
        type: Array,
        required: true,
    },
    BC: {
        type: Array,
        required: true,
    },
    CYL: {
        type: Array,
        required: true,
    },
    AX: {
        type: Array,
        required: true,
    },
    changePeriod: {
        type: String,
        default: 'месяц',
    },
    color: {
        type: String,
        default: 'прозрачные',
    },
    UVFilter: {
        type: Boolean,
        default: false,
    },
    design: {
        type: String,
        default: 'сферические',
    },
    moisture: {
        type: Number,
        default: 38,
    },
    amountInPack: {
        type: Number,
        default: 2,
    },
    oxygen: {
        type: Number,
        default: 129.0,
    },
    material: {
        type: String,
        required: 'cиликон-гидрогелевые',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: {
        type: Object,
    },  
}, 
{
    timestamps: true, // прикручием дату создания и обновления сущности
});

export default mongoose.model('Lens', LensSchema);