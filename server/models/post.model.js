import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    content: {type: String, required: true},
    title: {type: String, required: true, unique: true},
    image: {type: String, default: 'https://www.shutterstock.com/image-vector/woman-traffic-police-officer-policeman-260nw-1779440324.jpg'},
    category: {type: String, required: true},
    slug: {type: String, required: true, unique: true}
}, {timestamps: true})

const Post = mongoose.model('Post', PostSchema);

export default Post