import mongoose from "mongoose";

const UserPostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    content: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    image: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/woman-traffic-police-officer-policeman-260nw-1779440324.jpg",
    },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const UserPost = mongoose.model("UserPost", UserPostSchema);

export default UserPost;
