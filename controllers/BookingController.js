import BookingModel from "../models/BookingModel.js";


export const create = async (req, res) => {
    try {
        
        const doc = new BookingModel({
            guest: req.body.guest,
            note: req.body.note,
            price: req.body.price,
            roomNumber: req.body.roomNumber,
            startDate: req.body.startDate,
            daysOfReservation: req.body.daysOfReservation,
        });

        const booking = await doc.save();
        res.json(booking);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать бронирование',
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const count = req.params.count
        const skip = req.params.skip
        const bookings = await BookingModel.find().skip(skip).limit(count).exec();
        const docsCount = await BookingModel.countDocuments({})
        res.json({bookings, docsCount});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить бронирования',
        })
    }
}


export const remove = async (req, res) => {
    try {
        const ids = req.body;
        await BookingModel.deleteMany({ _id: { $in: ids }})

        res.json({
            success: true,
            deletedIds: ids,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не получилось удалить бронирование',
        })
    }
}








