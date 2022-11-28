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
            .map (el => set.add(el));  
        
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


export const create = async (req, res) => {
    try {
        const doc = new ProductModel({
            category: req.body.category,
            name: req.body.name,
            code: req.body.code,
            description: req.body.description,
            price: req.body.price,
            features: req.body.features,
            options: req.body.options,
            viewsCount: req.body.viewsCount,
            buyCount: req.body.buyCount,
            shape: req.body.shape,
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
            
            user: req.userId,
            imageUrl: req.body.imageUrl,
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

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        ProductModel.findOneAndUpdate({ // метод в монгуз, который помогает не только получить один объект, но и обноваить просмотры этой статьи
            _id: postId,
        },
            { $inc: { viewsCount: 1 }, }, // что увеличиваем
            { returnDocument: 'after', }, // возвращаем документ уже после инкриза вьюкаунт
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'не удалось вернуть статью',
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'статья не найдена',
                    });
                }

                res.json(doc)
            }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'cannot get articles',
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
                    message: 'не получилось удалить статью',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'удаляемая статья не найдена',
                })
            }

            res.json({
                success: true,
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'cannot delete article',
        })
    }
}


export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(postId);
        await ProductModel.updateOne({ _id: postId },
            {
                name: req.body.name,
                text: req.body.text,
                price: req.body.price,
                category: req.body.category,
                features: req.body.features,
                options: req.body.options,
                buyCount: req.body.buyCount,
                photos: req.body.photos,
                user: req.userId,
                mainImageUrl: req.body.imageUrl,
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