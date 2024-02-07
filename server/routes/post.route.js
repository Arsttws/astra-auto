import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getPosts,
  deletePost,
  updatePost,
  createUserPost,
  getUserPosts,
  deleteUserPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getPosts);
router.post("/user/create", verifyToken, createUserPost);
router.get("/user/getposts", getUserPosts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletePost);
router.delete("/user/deletepost/:postId/:userId", verifyToken, deleteUserPost);
router.put("/updatepost/:postId/:userId", verifyToken, updatePost);

export default router;
