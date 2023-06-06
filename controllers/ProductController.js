import ProductModel from "../models/ProductModel.js";


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

export const getFeatures = async (req, res) => {
    try {
        const products = await ProductModel.find().exec(); // exec - search method of regexp

        const set = new Set();
        products.map(obj => obj.features).flat() // flat - метод массива в котором все элементы вложенных массивов рекурсивно подняты на указанный уровень в скобках
            .map(el => set.add(el));

        const features = [];
        for (let feature of set) {
            features.push(feature);
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
        res.json(colors);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot get colors'
        })
    }
}
export const getShapes = async (req, res) => {
    try {
        const products = await ProductModel.find().exec(); // exec - search method of regexp
        const set = new Set();
        products.map(obj => obj.shape).flat() // flat - метод массива в котором все элементы вложенных массивов рекурсивно подняты на указанный уровень в скобках
            .map(el => set.add(el));
        const shapes = [];
        for (let shape of set) {
            shapes.push(shape);
        }
        res.json(shapes);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot get shapes'
        })
    }
}
export const getMaterials = async (req, res) => {
    try {
        const products = await ProductModel.find().exec(); // exec - search method of regexp
        const set = new Set();
        products.map(obj => obj.material).flat() // flat - метод массива в котором все элементы вложенных массивов рекурсивно подняты на указанный уровень в скобках
            .map(el => set.add(el));
        const materials = [];
        for (let material of set) {
            materials.push(material);
        }
        res.json(materials);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot get materials'
        })
    }
}


export const search = async (req, res) => {
    try {
        const query = req.body.query;
        const regex = new RegExp(`${query}`, 'i', 'g');
        const products = await ProductModel.find({
            name: {
                $regex: regex,
            }, 
        }).limit(10);

        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot find products'
        })
    }
}

export const create = async (req, res) => {
    try {
        const userId = req.user.id;

        const doc = new ProductModel({
            category: req.body.category,
            name: req.body.name,
            code: req.body.code,
            description: req.body.description,
            price: req.body.price,
            gender: req.body.gender,
            features: req.body.features,
            options: req.body.options,
            viewsCount: req.body.viewsCount,
            buyCount: req.body.buyCount,
            shape: req.body.shape,
            color: req.body.color,
            pupillaryDistance: req.body.pupillaryDistance,
            frameWidth: req.body.frameWidth,
            lensWidth: req.body.lensWidth,
            bridge: req.body.bridge,
            templeLength: req.body.templeLength,
            lensHeight: req.body.lensHeight,
            weight: req.body.weight,
            material: req.body.material,
            prescriptionMin: req.body.prescriptionMin,
            prescriptionMax: req.body.prescriptionMax,
            user: userId,
            imageUrl: req.body.imageUrl,
            inStockQuantity: req.body.inStockQuantity,
        });

        const product = await doc.save();
        res.json(product);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать product',
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const products = await ProductModel.find().populate('user').exec(); //последние два метода нужны чтобы получить не только айди юзера, но и его данные все
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'cannot get products',
        })
    }
}
export const getFilteredProducts = async (req, res) => {
    try {
        const filterName = req.body.filterName;
        const filterOption = req.body.filterOption;
        const products = await ProductModel.find({ [filterName]: `${filterOption}` }).limit(9)
            .populate('user').exec(); //последние два метода нужны чтобы получить не только айди продукта, но и его данные все
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
        ProductModel.findOneAndUpdate({ 
            _id: Id,
        },
            { $inc: { viewsCount: 1 }, }, // что увеличиваем
            { returnDocument: 'after', }, // возвращаем документ уже после инкриза вьюкаунт
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'не удалось показать товар',
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'товар не найден',
                    });
                }

                res.json(doc)
            }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'товар не найден',
        })
    }
};


export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        ProductModel.findOneAndDelete({ _id: postId }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'не получилось удалить продукт',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'удаляемый продукт не найден',
                })
            }

            res.json({
                success: true,
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'cannot delete product',
        })
    }
}


export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await ProductModel.updateOne({ _id: postId },
            {
                category: req.body.category,
                name: req.body.name,
                code: req.body.code,
                description: req.body.description,
                price: req.body.price,
                gender: req.body.gender,
                features: req.body.features,
                options: req.body.options,
                viewsCount: req.body.viewsCount,
                buyCount: req.body.buyCount,
                shape: req.body.shape,
                color: req.body.color,
                pupillaryDistance: req.body.pupillaryDistance,
                frameWidth: req.body.frameWidth,
                lensWidth: req.body.lensWidth,
                bridge: req.body.bridge,
                templeLength: req.body.templeLength,
                lensHeight: req.body.lensHeight,
                weight: req.body.weight,
                material: req.body.material,
                prescriptionMin: req.body.prescriptionMin,
                prescriptionMax: req.body.prescriptionMax,
                user: req.user._id,
                imageUrl: req.body.imageUrl,
                inStockQuantity: req.body.inStockQuantity,
            },
        );

        res.json({
            success: true,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить продукт',
        })
    }
}





