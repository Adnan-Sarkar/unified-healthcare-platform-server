import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { blogService } from "./blog.service";
import AppError from "../../error/AppError";

// create new blog
const createNewBlog = catchAsync(async (req, res) => {
  const result = await blogService.createNewBlog(req.body, req.user);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create blog");
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New blog created successfully",
    data: null,
  });
});

// get all blogs
const getAllBlogs = catchAsync(async (req, res) => {
  const { search } = req.query;
  const result = await blogService.getAllBlogs(search as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs retrived successfully",
    data: result,
  });
});

// get single blog
const getSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogService.getSingleBlog(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrived successfully",
    data: result,
  });
});

// related blogs
const getRelatedBlogs = catchAsync(async (req, res) => {
  const { blogOwnerId, tags } = req.query;
  const result = await blogService.getRelatedBlogs(
    blogOwnerId as string,
    tags as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Related blogs retrived successfully",
    data: result,
  });
});

// comment in a blog (add + remove)
const commentIntoBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogService.commentIntoBlog(req.body, req.user, id);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to comment");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment into blog successfully",
    data: null,
  });
});

// reaction in a blog (add + remove)
const reactionIntoBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogService.reactionIntoBlog(req.body, req.user, id);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to reaction");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reaction into blog successfully",
    data: null,
  });
});

// update a blog
const updateBlogById = catchAsync(async (req, res) => {
  const { id } = req.params;
  await blogService.updateBlogById(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully",
    data: null,
  });
});

// delete a blog
const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogService.deleteBlog(id, req.user);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete blog");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully",
    data: null,
  });
});

export const blogController = {
  createNewBlog,
  getAllBlogs,
  getSingleBlog,
  getRelatedBlogs,
  commentIntoBlog,
  reactionIntoBlog,
  updateBlogById,
  deleteBlog,
};
