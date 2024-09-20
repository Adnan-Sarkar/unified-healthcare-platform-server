import express from "express";
import { blogController } from "./blog.controller";

const router = express.Router();

router.get("/", blogController.getAllBlogs);

router.get("/:id", blogController.getSingleBlog);

router.get("/:id", blogController.getRelatedBlogs);

router.post("/create-blog", blogController.createNewBlog);

router.post("/comment-blog", blogController.commentIntoBlog);

router.post("/reaction-blog", blogController.reactionIntoBlog);

router.post("/reaction-blog", blogController.reactionIntoBlog);

router.patch("/:id", blogController.updateBlogById);

router.delete("/:id", blogController.deleteBlog);

export const blogRoutes = router;
