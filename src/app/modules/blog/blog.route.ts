import express from "express";
import { blogController } from "./blog.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { blogValidationSchema } from "./blog.validation";

const router = express.Router();

router.get("/", blogController.getAllBlogs);

router.get("/related-blogs", blogController.getRelatedBlogs);

router.get("/:id", blogController.getSingleBlog);

router.post(
  "/create-blog",
  auth("user"),
  validateRequest(blogValidationSchema.createblogValidationSchema),
  blogController.createNewBlog
);

router.post(
  "/comment-blog/:id",
  auth("user"),
  validateRequest(blogValidationSchema.commentIntoBlogValidationSchema),
  blogController.commentIntoBlog
);

router.post(
  "/reaction-blog/:id",
  auth("user"),
  validateRequest(blogValidationSchema.reactionIntoBlogValidationSchema),
  blogController.reactionIntoBlog
);

router.patch(
  "/:id",
  validateRequest(blogValidationSchema.updateBlogValidationSchema),
  blogController.updateBlogById
);

router.delete("/:id", auth("user"), blogController.deleteBlog);

export const blogRoutes = router;
