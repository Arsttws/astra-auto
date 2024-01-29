import experess from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js'
import carsRoutes from './routes/car.route.js'
import 'dotenv/config'
import cookieParser from 'cookie-parser'

mongoose.connect(process.env.DB_CONNECTION).then(
    () => {console.log('db connected')}
).catch((error) => {
    console.log(error);
});

const app = experess()
const PORT = process.env.PORT

app.use(experess.json());
app.use(cookieParser())

app.listen(PORT, () => {
    console.log('server is running on port: ' + PORT);
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/car', carsRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})