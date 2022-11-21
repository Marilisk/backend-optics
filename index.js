import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from 'cors';
import { registerValidator, loginValidator, postCreateValidator } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import {PostController, UserController} from './controllers/index.js';
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose.connect(
    'mongodb+srv://admin:Zxcvbn123@cluster0.kr9exh8.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err)
    );

const app = express();

const storage = multer.diskStorage({  // создаём хранилище для файлов 
    destination: (_, __, cb) => {
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

app.get('/posts', PostController.getAll);
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostController.create);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostController.update);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('server OK');
});