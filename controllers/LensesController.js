import ProductModel from "../models/ProductModel.js";
import jwt from 'jsonwebtoken';
import LensModel from "../models/LensModel.js";
import UserModel from "../models/UserModel.js";

export const getAllLenses = async (req, res) => {
    try {
        const lenses = await LensModel.find().populate('user').exec(); //последние два метода нужны чтобы получить не только айди юзера, но и его данные все
        res.json(lenses);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'cannot get lenses',
        })
    }
}

export const getLastFeatures = async (req, res) => {
    try {
        const products = await ProductModel.find().limit(50).exec(); // limit is for tasking last 5 prods features. exec - method of regexp searches
        const features = products.map(obj => obj.features).flat().slice(0, 5);  // flat - метод массива в котором все элементы вложенных массивов рекурсивно подняты на указанный уровень в скобках

        res.json(features);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot get features'
        })
    }
}

export const getLensesFeatures = async (req, res) => {
    try {
        const lenses = await LensModel.find().exec(); // exec - search method of regexp

        const set = new Set();
        lenses.map(obj => obj.features).flat() // flat - метод массива в котором все элементы вложенных массивов рекурсивно подняты на указанный уровень в скобках
            .map(el => set.add(el));

        const features = [];
        for (let lenses of set) {
            features.push(lenses);
        }

        res.json(features);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot get features'
        })
    }
}
export const getColors = async (req, res) => {
    try {
        const products = await ProductModel.find().exec(); // exec - search method of regexp

        const set = new Set();
        products.map(obj => obj.color).flat() // flat - метод массива в котором все элементы вложенных массивов рекурсивно подняты на указанный уровень в скобках
            .map(el => set.add(el));

        const colors = [];
        for (let color of set) {
            colors.push(color);
        }
        //console.log(colors);
        res.json(colors);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot get colors'
        })
    }
}

export const searchLenses = async (req, res) => {
    try {
        const query = req.body.query;
        const regex = new RegExp(`${query}`, 'i', 'g');
        const lenses = await LensModel.find({
            name: {
                $regex: regex,
            },
        }).limit(40);

        res.json(lenses);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot find lenses'
        })
    }
}


export const create = async (req, res) => {
    try {
        const userId = req.user.id;

        const doc = new LensModel({
            category: req.body.category,
            brand: req.body.brand,
            manufacturer: req.body.manufacturer,
            manufacturerCountry: req.body.manufacturerCountry,
            code: req.body.code,
            description: req.body.description,
            price: req.body.price,
            prescription: req.body.prescription,
            BC: req.body.BC,
            CYL: req.body.CYL,
            AX: req.body.AX,
            changePeriod: req.body.changePeriod,
            color: req.body.color,
            UVFilter: req.body.UVFilter,
            design: req.body.design,
            moisture: req.body.moisture,
            amountInPack: req.body.amountInPack,
            oxygen: req.body.oxygen,
            material: req.body.material,
            user: userId,
            imageUrl: req.body.imageUrl,
        });

        const lenses = await doc.save();
        res.json(lenses);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать lenses',
        })
    }
}


export const getFilteredProducts = async (req, res) => {
    try {
        console.log(req.body);
        const filterName = req.body.filterName;
        const filterOption = req.body.filterOption;
        const products = await ProductModel.find({ [filterName]: `${filterOption}` }).limit(9)
            .populate('user').exec(); //последние два метода нужны чтобы получить не только айди юзера, но и его данные все
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'cannot get products',
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const Id = req.params.id;
        const lenses = await LensModel.findOne({ _id: Id }).exec();
        res.json(lenses);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'линзы не найдены',
        })
    }
};


export const remove = async (req, res) => {
    try {
        const Id = req.params.id;

        LensModel.findOneAndDelete({ _id: Id }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'не получилось удалить линзы',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'удаляемые линзы не найдены',
                })
            }

            res.json({
                success: true,
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'cannot delete lenses',
        })
    }
}


export const update = async (req, res) => {
    try {
        const Id = req.params.id;
        //console.log(postId);
        await LensModel.updateOne({ _id: Id },
            {
                category: req.body.category,
                brand: req.body.brand,
                manufacturer: req.body.manufacturer,
                manufacturerCountry: req.body.manufacturerCountry,
                code: req.body.code,
                description: req.body.description,
                price: req.body.price,
                prescription: req.body.prescription,
                BC: req.body.BC,
                CYL: req.body.CYL,
                AX: req.body.AX,
                changePeriod: req.body.changePeriod,
                color: req.body.color,
                UVFilter: req.body.UVFilter,
                design: req.body.design,
                moisture: req.body.moisture,
                amountInPack: req.body.amountInPack,
                oxygen: req.body.oxygen,
                material: req.body.material,
                user: req.userId,
                imageUrl: req.body.imageUrl,
            },
        );

        res.json({
            success: true,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить линзы',
        })
    }
}






