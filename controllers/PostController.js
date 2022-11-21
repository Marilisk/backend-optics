import PostModel from "../models/PostModel.js";


export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось содать статью',
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec(); //последние два метода нужны чтобы получить не только айди юзера, но и его данные все
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'cannot get articles',
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate({ // метод в монгуз, который помогает не только получить один объект, но и обноваить просмотры этой статьи
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

        PostModel.findOneAndDelete({ _id: postId }, (err, doc) => {
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

        await PostModel.updateOne({ _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            },
        );

        res.json({
            success: true,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        })
    }
}