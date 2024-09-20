import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { blogService } from "./blog.service";

// create new blog
const createNewBlog = catchAsync(async (req, res) => {
  const result = await blogService.createNewBlog();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Create new blog successfull",
    data: result,
  });
});

// get all blogs
const getAllBlogs = catchAsync(async (req, res) => {
  const result = await blogService.getAllBlogs();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs retrived successfully",
    data: result,
  });
});

// get single blog
const getSingleBlog = catchAsync(async (req, res) => {
  const result = await blogService.getSingleBlog();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrived successfully",
    data: result,
  });
});

// related blogs
const getRelatedBlogs = catchAsync(async (req, res) => {
  const result = await blogService.getRelatedBlogs();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Related blogs retrived successfully",
    data: result,
  });
});

// comment in a blog (add + remove)
const commentIntoBlog = catchAsync(async (req, res) => {
  const result = await blogService.commentIntoBlog();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment into blog successfully",
    data: result,
  });
});

// reaction in a blog (add + remove)
const reactionIntoBlog = catchAsync(async (req, res) => {
  const result = await blogService.reactionIntoBlog();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reaction into blog successfully",
    data: result,
  });
});

// update a blog
const updateBlogById = catchAsync(async (req, res) => {
  const result = await blogService.updateBlogById();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});

// delete a blog
const deleteBlog = catchAsync(async (req, res) => {
  const result = await blogService.deleteBlog();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully",
    data: result,
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
