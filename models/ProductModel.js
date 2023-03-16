import mongoose, {Schema} from "mongoose";

const ProductSchema = new Schema({
    category: {
        type: String,
        required: true,
        default: 'eyewear',
    },
    name: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    
    price: {
        type: Number,
        required: true,
    },
    gender: {
        type: Array,
        required: true,
    },    
    features: {
        type: Array,
        default: [],
    },
    options: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    buyCount: {
        type: Number,
        default: 0,
    },
    shape: {
        type: Array,
        required: true,
    },
    color: {
        type: Array,
        required: true,
    },
    pupillaryDistance: {
        type: Array,
        required: true,
    },
    frameWidth: {
        type: Number,
        default: 0,
    },
    lensWidth: {
        type: Number,
        default: 0,
    },
    bridge: {
        type: Number,
        default: 0,
    },
    templeLength: {
        type: Number,
        default: 0,
    },
    lensHeight: {
        type: Number,
        default: 0,
    },
    weight: {
        type: Number,
        default: 0,
    },

    material: {
        type: Array,
        required: true,
    },
    prescriptionMin: {
        type: Number,
        required: true,
    },
    prescriptionMax: {
        type: Number,
        required: true,
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
    timestamps: true, 
});

export default mongoose.model('Product', ProductSchema);