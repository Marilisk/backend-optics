import express from "express";
import multer from "multer";
import fs from 'fs';
import mongoose from "mongoose";
import cors from 'cors';
import { registerValidator, loginValidator, productCreateValidator } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import {ProductController, UserController} from './controllers/index.js';
import handleValidationErrors from "./utils/handleValidationErrors.js";

// 'mongodb+srv://admin:Zxcvbn123@cluster0.kr9exh8.mongodb.net/blog?retryWrites=true&w=majority'

mongoose.connect(
    process.env.MONGODB_URI)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err)
    );

const app = express();

const storage = multer.diskStorage({  // создаём хранилище для файлов 
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');  // библиотека fs создает папку аплоадс если её пока нет
        }
        cb(null, 'uploads');  // функция кот вернет путь этого файла
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({storage});

app.use(express.json());  //чтобы экпресс понял формат json
app.use('/uploads', express.static('uploads')); // чтобы при запросах на аплоад экспресс поняла чаво показывать в папкек аплоадс 
app.use(cors());

app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
})

app.get('/products', ProductController.getAll);
app.get('/features', ProductController.getFeatures);

app.post('/products', checkAuth, productCreateValidator, handleValidationErrors, ProductController.create);
app.get('/products/:id', ProductController.getOne);
app.delete('/products/:id', checkAuth, ProductController.remove);
app.patch('/products/:id', checkAuth, productCreateValidator, handleValidationErrors, ProductController.update);


app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('server OK');
});