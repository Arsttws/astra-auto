import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profileImg: {type: String, default: "https://firebasestorage.googleapis.com/v0/b/astra-auto.appspot.com/o/1706299118802defaultUser.svg?alt=media&token=8b1d7f7d-7f81-4eaa-a933-49adaf20c5d8"},
    isAdmin: {type: Boolean, default: false}
},  {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;
