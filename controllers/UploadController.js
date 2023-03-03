import fs from 'fs';
import LensModel from '../models/LensModel.js';
import ProductModel from '../models/ProductModel.js';


export const getAllFiles = (req, res) => {
    const directoryPath = './uploads';

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                //url: baseUrl + file,
            });
        });

        res.status(200).send(fileInfos);
    });
}

export const getOwner = async (req, res) => {
    try {
        const photoName = `/uploads/${req.params.name}`

        let product = await ProductModel.find({ 'imageUrl.main': photoName })
        if (!product.length) {
            product = await ProductModel.find({ 'imageUrl.side': photoName })
            if (!product.length) {
                product = await ProductModel.find({ 'imageUrl.perspective': photoName })
                if (!product.length) {
                    product = await LensModel.find({ 'imageUrl.main': photoName })
                    if (!product.length) {
                        product = await LensModel.find({ 'imageUrl.side': photoName })
                        if (!product.length) {
                            product = await LensModel.find({ 'imageUrl.perspective': photoName })
                            if (!product.length) {
                                return res.json({ message: 'No product' })
                            }
                        }
                    }
                }
            }
        }

        /* switch(photoName) {
            case 
        } */

        res.json(product)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot find product'
        })
    }
}



export const deletePhoto = (req, res) => {
    try {
        const fileName = `./uploads/${req.params.name}`
        fs.unlink(fileName, (err) => {
            if (err) {
                throw err
            }
            //console.log('Photo deleted successfully')
            res.json({ message: 'Photo deleted successfully' })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot delete photo'
        })
    }

}