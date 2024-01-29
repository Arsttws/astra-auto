import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Вам не разрешено редактировать данного пользователя'))
    }
    if(req.body.password) {
        if(req.body.password.length < 8) {
        return next(errorHandler(400, 'Пароль должен содержать минимум 8 символов'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if(req.body.username) {
        if(req.body.username.length < 4 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Имя пользователя должно быть больше 4 и меньше 20 символов'))
        }
        if(req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Имя пользователя не должно содержать пробелы'))
        }
        if(req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Имя пользователя не должно содержать заглавных букв'))
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Имя пользователя может содержать только буквы английского алфавита и цифры'))
        }
    }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profileImg: req.body.profileImg,
                    password: req.body.password,
                },
            }, {new: true});
            const { password, ...rest } = updatedUser._doc;
            res.status(200).json(rest)
        } catch (error) {
            next(error)
        }
    }

export const deleteUser = async (req, res, next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Вам не разрешено удалать этого пользователя'));
    }
    try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('Пользователь успешно удален')
    } catch {
        next(error)
    }
}
export const signoutUser = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('Вы вышли из аккаунта')
    } catch {
        next(error)
    }
}

export const getUsers = async (req, res, next) => {
    if(!req.user.isAdmin) {
        return next(errorHandler(403, 'Вам не разрешено просматривать пользователей'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 12;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find().sort({ createdAt: sortDirection}).skip(startIndex).limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest
        });

        const totalUsers = await User.countDocuments();
        const now = new Date();

        const monthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: monthAgo },
        })
        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        })
    } catch(error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if(!user) {
            return next(errorHandler(404, 'Пользователь не найден'))
        }
        const { password, ...rest} = user._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}
