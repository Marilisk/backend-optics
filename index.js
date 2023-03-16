import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import multer from "multer";
import fs from 'fs';
import mongoose from "mongoose";
import cors from 'cors';
import { registerValidator, loginValidator } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import { LensesController, OrderController, ProductController, UploadsController, UserController } from './controllers/index.js';
import handleValidationErrors from "./utils/handleValidationErrors.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import roleMiddleWare from "./middlewares/roleMiddleWare.js";
import cookieParser from "cookie-parser";


mongoose.connect(process.env.MONGODB_URI)
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


app.use(express.json()); 
app.use(cookieParser());
app.use('/uploads', express.static('uploads')); // чтобы при запросах на аплоад экспресс поняла чаво показывать в папкек аплоадс 

app.use(cors({
    credentials: true,
    origin: true, 
    allowedHeaders:  ['Content-Type', 'Authorization'],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD'],
    preflightContinue: true,
}));

// files in uploads folder
const upload = multer({ storage });
app.post('/upload', roleMiddleWare('ADMIN'), upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
})

app.get('/photos', roleMiddleWare('ADMIN'), UploadsController.getAllFiles)
app.get('/photos/owner/:name', roleMiddleWare('ADMIN'), UploadsController.getOwner)
app.delete('/photos/:name', roleMiddleWare('ADMIN'), UploadsController.deletePhoto)


// AUTHENTIFICATION & USER METHODS
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register)
app.get('/auth/activate/:link', UserController.activate)
app.post('/auth/logout', UserController.logout)
app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/auth/refresh', UserController.refresh)
app.post('/auth/editavatar', authMiddleware, UserController.editUserAvatar)
app.post('/auth/editfullname', authMiddleware, UserController.editUserFullName)

app.post('/auth/adminrequest', UserController.adminRoleRequest);


// FAVOURITES
app.post('/addtofav', authMiddleware, UserController.addToFavorites);
app.post('/removefav', authMiddleware, UserController.removeFromFavorites);

// CART
app.post('/addtocart', authMiddleware, UserController.addEyewearToCart);
app.post('/removefromcart', authMiddleware, UserController.removeEyewearFromCart);
app.post('/editcart', authMiddleware, UserController.editCart);

// ORDERS
app.post('/createorder', authMiddleware, OrderController.create);
app.post('/editorder', authMiddleware, OrderController.edit);
app.post('/confirmorder', authMiddleware, OrderController.confirm)
app.get('/order/:id', authMiddleware, OrderController.getOne);
app.delete('/order/:id', authMiddleware, OrderController.deleteOrder);

//app.delete('/orders', authMiddleware, roleMiddleWare('ADMIN'), OrderController.deleteAllOrders);

// ORDERS ADMINISTRATE
app.get('/orders', roleMiddleWare('ADMIN'), OrderController.getAllOrders);
app.patch('/adminorder', roleMiddleWare('ADMIN'), OrderController.administrateOrder);

app.get('/auth/users', roleMiddleWare('ADMIN'), UserController.getAllUsers);
app.get('/user/:id', roleMiddleWare('ADMIN'), UserController.getOneUser);


// PRODUCTS
app.get('/products', ProductController.getAll);
app.post('/products/search', ProductController.search);
//app.get('/products', ProductController.getFilteredProducts);
app.get('/features', ProductController.getFeatures);
app.get('/color', ProductController.getColors);
app.get('/shape', ProductController.getShapes);
app.get('/material', ProductController.getMaterials);

app.post('/products', authMiddleware, roleMiddleWare('ADMIN'), ProductController.create);
app.get('/products/:id', ProductController.getOne);
app.delete('/products/:id', authMiddleware, roleMiddleWare('ADMIN'), ProductController.remove);
app.patch('/products/:id', authMiddleware, roleMiddleWare('ADMIN'), ProductController.update);

// LENSES
app.get('/lenses', LensesController.getAllLenses);
app.post('/lenses/search', LensesController.searchLenses);
app.get('/lensesfeatures', LensesController.getLensesFeatures);
app.get('/lenses/:id', LensesController.getOne);
// EDIT LENSES
app.post('/lenses', authMiddleware, roleMiddleWare('ADMIN'), LensesController.create);
app.delete('/lenses/:id', authMiddleware, roleMiddleWare('ADMIN'), LensesController.remove);
app.patch('/lenses/:id', authMiddleware, roleMiddleWare('ADMIN'), LensesController.update);


app.listen(process.env.PORT || 5555, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('server OK');
});