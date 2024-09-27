import { ResultSetHeader } from "mysql2";
import { TBlog, TBlogComment, TBlogReaction, TJWTPayload } from "../../types";
import db from "../../database/db";
import generateUniqueId from "../../utils/generateUniqueId";
import { PoolConnection, RowDataPacket } from "mysql2/promise";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

// create new blog
const createNewBlog = async (payload: Partial<TBlog>, user: TJWTPayload) => {
  const { title, content, publishedDate, coverPhoto, tags } = payload;
  const authorId = user.id;

  const blogId = generateUniqueId();

  let connection: PoolConnection;

  // Get a connection from the pool
  connection = await db.getConnection();

  // Start the transaction
  await connection.beginTransaction();

  try {
    // create new blog
    const [result]: [ResultSetHeader, any] = await connection.query(
      `INSERT INTO blog (id, authorId, title, content, publishedDate, coverPhoto) VALUES (?, ?, ?, ?, ?, ?)`,
      [blogId, authorId, title, content, publishedDate, coverPhoto]
    );

    // create new blog tags
    if (tags && tags?.length > 0) {
      tags.forEach(async (tagName) => {
        await connection.query(
          `INSERT INTO blog_tags (blogId, tagName) VALUES (?, ?)`,
          [blogId, tagName]
        );
      });
    }

    // commit the transaction
    await connection.commit();

    return result;
  } catch (error) {
    // rollback the transaction
    await connection.rollback();
    console.error("Transaction failed, rolling back:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Blog creation failed!"
    );
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

// get all blogs
const getAllBlogs = async (search: string) => {
  if (search) {
    const searchQuery = `%${search}%`;
    const [blogs]: [RowDataPacket[], any] = await db.query(
      `SELECT
        b.*,
        u.firstName AS authorFirstName,
        u.lastName AS authorLastName,
        u.profilePicture AS authorProfilePicture,
        GROUP_CONCAT(bt.tagName) AS tags,
        COUNT(DISTINCT bc.id) AS totalComments,
        COUNT(DISTINCT br.id) AS totalReactions
      FROM blog b
      LEFT JOIN blog_tags bt ON b.id = bt.blogId
      LEFT JOIN user u ON b.authorId = u.id
      LEFT JOIN blog_comment bc ON b.id = bc.blogId
      LEFT JOIN blog_reaction br ON b.id = br.blogId
      WHERE b.title LIKE ? OR b.id IN (
        SELECT DISTINCT blogId
        FROM blog_tags
        WHERE tagName LIKE ?
      )
      GROUP BY b.id`,
      [searchQuery, searchQuery]
    );

    return blogs?.map((blog) => ({
      ...blog,
      tags: blog.tags ? blog.tags.split(",") : [],
    }));
  } else {
    const [blogs]: [RowDataPacket[], any] = await db.query(
      `SELECT
        b.*,
        u.firstName AS authorFirstName,
        u.lastName AS authorLastName,
        u.profilePicture AS authorProfilePicture,
        GROUP_CONCAT(bt.tagName) AS tags,
        COUNT(DISTINCT bc.id) AS totalComments,
        COUNT(DISTINCT br.id) AS totalReactions
      FROM blog b
      LEFT JOIN blog_tags bt ON b.id = bt.blogId
      LEFT JOIN user u ON b.authorId = u.id
      LEFT JOIN blog_comment bc ON b.id = bc.blogId
      LEFT JOIN blog_reaction br ON b.id = br.blogId
      GROUP BY b.id`
    );
    return blogs?.map((blog) => ({
      ...blog,
      tags: blog.tags ? blog.tags.split(",") : [],
    }));
  }
};

// get single blog
const getSingleBlog = async (blogId: string) => {
  const [blog]: [RowDataPacket[], any] = await db.query(
    `SELECT
      b.*,
      u.firstName AS authorFirstName,
      u.lastName AS authorLastName,
      u.profilePicture AS authorProfilePicture,
      GROUP_CONCAT(bt.tagName) AS tags,
      COUNT(DISTINCT bc.id) AS totalComments,
      COUNT(DISTINCT br.id) AS totalReactions
    FROM blog b
    LEFT JOIN blog_tags bt ON b.id = bt.blogId
    LEFT JOIN user u ON b.authorId = u.id
    LEFT JOIN blog_comment bc ON b.id = bc.blogId
    LEFT JOIN blog_reaction br ON b.id = br.blogId
    WHERE b.id = ?`,
    [blogId]
  );

  return {
    ...blog[0],
    tags: blog[0]?.tags ? blog[0]?.tags.split(",") : [],
  };
};

// related blogs
const getRelatedBlogs = async (blogOwnerId: string, tagsString: string) => {
  const tags = tagsString?.split(",");

  if (blogOwnerId && tags?.length > 0) {
    // get 5 blogs of this blog owner
    const [blogsOfThisBlogOwner]: [RowDataPacket[], any] = await db.query(
      `SELECT
        b.title,
        b.id,
        b.coverPhoto,
        b.publishedDate,
        u.firstName AS authorFirstName,
        u.lastName AS authorLastName,
        u.profilePicture AS authorProfilePicture,
        COUNT(DISTINCT bc.id) AS totalComments,
        COUNT(DISTINCT br.id) AS totalReactions
      FROM blog b
      LEFT JOIN user u ON b.authorId = u.id
      LEFT JOIN blog_comment bc ON b.id = bc.blogId
      LEFT JOIN blog_reaction br ON b.id = br.blogId
      WHERE b.authorId = ?
      GROUP BY b.id
      LIMIT 5`,
      [blogOwnerId]
    );

    // get 5 blogs of this tags
    const [blogsOfThisTags]: [RowDataPacket[], any] = await db.query(
      `SELECT
        b.title,
        b.id,
        b.coverPhoto,
        b.publishedDate,
        u.firstName AS authorFirstName,
        u.lastName AS authorLastName,
        u.profilePicture AS authorProfilePicture,
        COUNT(DISTINCT bc.id) AS totalComments,
        COUNT(DISTINCT br.id) AS totalReactions
      FROM blog b
      LEFT JOIN blog_tags bt ON b.id = bt.blogId
      LEFT JOIN user u ON b.authorId = u.id
      LEFT JOIN blog_comment bc ON b.id = bc.blogId
      LEFT JOIN blog_reaction br ON b.id = br.blogId
      WHERE bt.tagName IN (?)
      GROUP BY b.id
      LIMIT 5`,
      [tags]
    );

    return {
      blogsOfThisBlogOwner,
      blogsOfThisTags,
    };
  }
};

// comment in a blog
const commentIntoBlog = async (
  payload: Partial<TBlogComment>,
  user: TJWTPayload,
  blogId: string
) => {
  const { id } = user;
  const { commentText, dateTime } = payload;

  const commentId = generateUniqueId();

  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO blog_comment (id, blogId, userId, commentText, dateTime) VALUES (?, ?, ?, ?, ?)`,
    [commentId, blogId, id, commentText, dateTime]
  );

  return result;
};

// reaction in a blog (add + remove)
const reactionIntoBlog = async (
  payload: {
    reaction: TBlogReaction;
    isRemove: boolean;
  },
  user: TJWTPayload,
  blogId: string
) => {
  const { id } = user;
  const { reaction, isRemove } = payload;

  if (isRemove === true) {
    const [result]: [ResultSetHeader, any] = await db.query(
      `DELETE FROM blog_reaction WHERE blogId = ? AND userId = ?`,
      [blogId, id]
    );

    return result;
  } else {
    const reactionId = generateUniqueId();
    const [result]: [ResultSetHeader, any] = await db.query(
      `INSERT INTO blog_reaction (id, blogId, userId, reactionType, dateTime) VALUES (?, ?, ?, ?, ?)`,
      [reactionId, blogId, id, reaction.reactionType, reaction.dateTime]
    );

    return result;
  }
};

// update a blog
const updateBlogById = async (
  payload: {
    blogData?: Partial<TBlog>;
    tags?: [
      {
        tagName: string;
        isRemove: boolean;
      }
    ];
  },
  blogId: string
) => {
  const { title, content, publishedDate, coverPhoto } = payload?.blogData ?? {};

  const fieldsToUpdate: string[] = [];
  const valuesToUpdate: any[] = [];

  if (title) {
    fieldsToUpdate.push("title = ?");
    valuesToUpdate.push(title);
  }

  if (content) {
    fieldsToUpdate.push("content = ?");
    valuesToUpdate.push(content);
  }

  if (publishedDate) {
    fieldsToUpdate.push("publishedDate = ?");
    valuesToUpdate.push(publishedDate);
  }

  if (coverPhoto) {
    fieldsToUpdate.push("coverPhoto = ?");
    valuesToUpdate.push(coverPhoto);
  }

  if (title || content || publishedDate || coverPhoto) {
    const [result]: [ResultSetHeader, any] = await db.query(
      `UPDATE blog SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
      [...valuesToUpdate, blogId]
    );

    if (result?.affectedRows === 0) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Blog not updated!");
    }
  }

  if (payload?.tags && payload?.tags?.length > 0) {
    payload?.tags?.forEach(async (tag) => {
      if (tag?.isRemove === true) {
        const [result]: [ResultSetHeader, any] = await db.query(
          `DELETE FROM blog_tags WHERE blogId = ? AND tagName = ?`,
          [blogId, tag?.tagName]
        );

        if (result?.affectedRows === 0) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            "Tag not found in this blog!"
          );
        }
      } else {
        const [result]: [ResultSetHeader, any] = await db.query(
          `INSERT INTO blog_tags (blogId, tagName) VALUES (?, ?)`,
          [blogId, tag?.tagName]
        );

        if (result?.affectedRows === 0) {
          throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Tag not added in this blog!"
          );
        }
      }
    });
  }
};

// delete a blog
const deleteBlog = async (blogId: string, user: TJWTPayload) => {
  let isAuthorDeletingTheBlog: boolean;

  // Check if the user deleting the blog is the author
  const [authorResult]: [RowDataPacket[], any] = await db.query(
    "SELECT authorId FROM blog WHERE id = ?",
    [blogId]
  );

  if (authorResult.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  isAuthorDeletingTheBlog = authorResult[0].authorId === user.id;

  if (!isAuthorDeletingTheBlog) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only the author can delete this blog"
    );
  }

  let connection: PoolConnection;

  // Get a connection from the pool
  connection = await db.getConnection();

  // Start the transaction
  await connection.beginTransaction();

  try {
    // Delete blog tags
    await connection.query("DELETE FROM blog_tags WHERE blogId = ?", [blogId]);

    // Delete comments
    await connection.query("DELETE FROM blog_comment WHERE blogId = ?", [
      blogId,
    ]);

    // Delete reactions
    await connection.query("DELETE FROM blog_reaction WHERE blogId = ?", [
      blogId,
    ]);

    // Delete the blog
    const [result]: [ResultSetHeader, any] = await connection.query(
      "DELETE FROM blog WHERE id = ?",
      [blogId]
    );

    // commit the transaction
    await connection.commit();

    return result;
  } catch (error) {
    // rollback the transaction
    await connection.rollback();
    console.error("Transaction failed, rolling back:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Blog deletion failed!"
    );
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

export const blogService = {
  createNewBlog,
  getAllBlogs,
  getSingleBlog,
  getRelatedBlogs,
  commentIntoBlog,
  reactionIntoBlog,
  updateBlogById,
  deleteBlog,
};
