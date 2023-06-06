import mongoose from "mongoose";

const LensSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        default: 'Lenses',
    },
    brand: {
        type: String,
    },
    manufacturer: {
        type: String,
    },
    manufacturerCountry: {
        type: String,
        default: 'США',
    },
    code: {
        type: Number,
        default: 105034987,
    },
    description: {
        type: String,
        default: '',
    },
    
    price: {
        type: Number,
        default: 0,
    },
   
    prescription: {
        type: Array,
    },
    BC: {
        type: Array,
    },
    CYL: {
        type: Array,
    },
    AX: {
        type: Array,
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
        default: 'cиликон-гидрогелевые',
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