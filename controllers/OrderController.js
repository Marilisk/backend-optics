import UserModel from '../models/UserModel.js';
import OrderModel from '../models/OrderModel.js';

export const create = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        //console.log('req                   ', req.body)
        const newOrder = new OrderModel({
            cart: req.body.cart,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            paymentMade: req.body.paymentMade,
            paymentWay: req.body.paymentWay,
            userId: req.user.id,
            condition: req.body.condition,
        });

        const order = await newOrder.save();
        const newOrderId = order._id
        user.orders.push(newOrderId)
        user.save()
        res.json(order);
    } catch (error) {
        console.log('createOrder error ', error);
        res.status(500).json({
            message: 'Не удалось создать product',
        })
    }
}


export const edit = async (req, res, next) => {
    try {
        const innovatedOrder = req.body
        const order = await OrderModel.findOneAndUpdate({ _id: innovatedOrder._id },
            {
                cart: innovatedOrder.cart,
                address: innovatedOrder.address,
                phoneNumber: innovatedOrder.phoneNumber,
                paymentMade: innovatedOrder.paymentMade,
                paymentWay: innovatedOrder.paymentWay,
                condition: innovatedOrder.condition,
                additionalInfo: innovatedOrder.additionalInfo
            },
            { returnDocument: 'after', },)


        res.json(order);
    } catch (error) {
        console.log('editOrder error', error)
        return res.status(500).json({
            message: 'Cannot Edit order'
        })
    }
}

export const confirm = async (req, res, next) => {
    try {

        const innovatedOrder = req.body
        let order = await OrderModel.findOneAndUpdate({ _id: innovatedOrder._id }, {
            cart: innovatedOrder.cart,
            address: innovatedOrder.address,
            phoneNumber: innovatedOrder.phoneNumber,
            paymentMade: innovatedOrder.paymentMade,
            paymentWay: innovatedOrder.paymentWay,
            condition: innovatedOrder.condition,
            additionalInfo: innovatedOrder.additionalInfo
        },
            { returnDocument: 'after', },)

        const user = await UserModel.findById(req.user.id)
        if (!user.orders.includes(innovatedOrder._id)) {
            return res.status(404).json({
                message: 'You have no access for this order'
            })
        }
        user.cart = []
        await user.save()

        res.json(order);
    } catch (error) {
        console.log('confirmOrder error', error)
        return res.status(500).json({
            message: 'Cannot confirm order'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const Id = req.params.id;
        const user = await UserModel.findById(req.user.id)
        if (!user.orders.includes(Id)) {
            return res.status(404).json({
                message: 'You have no access for this order'
            })
        }
        const order = await OrderModel.findOne({ _id: Id })
        res.json(order)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'order not found',
        })
    }
}

export const deleteOrder = async (req, res, next) => {
    try {
        const Id = req.params.id;
        const user = await UserModel.findById(req.user.id)
        if (!user.orders.includes(Id)) {
            return res.status(404).json({
                message: 'You have no access for this order'
            })
        }
        await OrderModel.findByIdAndRemove(Id)
        const renewedOrders = user.orders.filter(el => el.toString() !== Id)
        await UserModel.findByIdAndUpdate({ _id: req.user.id }, {
            orders: renewedOrders,
        },
            { returnDocument: 'after', },);
        return res.json({ message: 'successfully deleted' })
    } catch (error) {
        console.log('deleteOrder error', error)
        res.status(500).json({
            message: 'Cannot remove order'
        })

    }
}

export const deleteAllOrders = async (req, res, next) => {
    try {
        await OrderModel.deleteMany()
        return res.json({ message: 'successfully deleted' })
    } catch (error) {
        console.log('deleteOrder error', error)
        res.status(500).json({
            message: 'Cannot remove orders'
        })
    }
}


export const administrateOrder = async (req, res, next) => {
    try {
        const innovatedOrder = req.body
        const order = await OrderModel.findOneAndUpdate({ _id: innovatedOrder._id }, {
            cart: innovatedOrder.cart,
            address: innovatedOrder.address,
            phoneNumber: innovatedOrder.phoneNumber,
            paymentMade: innovatedOrder.paymentMade,
            paymentWay: innovatedOrder.paymentWay,
            condition: innovatedOrder.condition,
            additionalInfo: innovatedOrder.additionalInfo,
            manager: innovatedOrder.manager
        },
            { returnDocument: 'after', },)
        if (!order) {
            return res.status(404).json({
                message: 'такой заказ не найден',
            })
        }
        res.json(order);
    } catch (error) {
        console.log('editOrder error', error)
        return res.status(500).json({
            message: 'Cannot edit order'
        })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find()
        res.json(orders)
    } catch (error) {
        console.log('editOrder error', error)
        return res.status(500).json({
            message: 'Cannot get orders'
        })
    }
}


