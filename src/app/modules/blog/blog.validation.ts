import { z } from "zod";

// create blog
const createblogValidationSchema = z.object({
  authorId: z.string({
    required_error: "Author ID is required",
    invalid_type_error: "Author ID must be a string",
  }),
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  content: z.string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string",
  }),
  publishedDate: z.string({
    required_error: "Published date is required",
    invalid_type_error: "Published date must be a string",
  }),
  coverPhoto: z
    .string({
      invalid_type_error: "Cover photo URL must be a string",
    })
    .optional(),
  tags: z.array(z.string()).optional(),
});

// comment into blog
const commentIntoBlogValidationSchema = z.object({
  commentText: z.string({
    required_error: "Comment text is required",
    invalid_type_error: "Comment text must be a string",
  }),
  dateTime: z.string({
    required_error: "Date time is required",
    invalid_type_error: "Date time must be a string",
  }),
});

// reaction into blog
const reactionIntoBlogValidationSchema = z.object({
  reaction: z.object({
    reactionType: z.enum(["like", "unlike"]),
    dateTime: z.string(),
  }),
  isRemove: z.boolean(),
});

// update blog
const updateBlogValidationSchema = z.object({
  blogData: z
    .object({
      title: z.string().optional(),
      content: z.string().optional(),
      publishedDate: z.string().optional(),
      coverPhoto: z.string().optional(),
    })
    .optional(),
  tags: z
    .array(
      z.object({
        tagName: z.string(),
        isRemove: z.boolean(),
      })
    )
    .optional(),
});

export const blogValidationSchema = {
  createblogValidationSchema,
  updateBlogValidationSchema,
  commentIntoBlogValidationSchema,
  reactionIntoBlogValidationSchema,
};
