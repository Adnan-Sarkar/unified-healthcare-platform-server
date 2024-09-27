export type TBlog = {
  authorId: string;
  title: string;
  content: string;
  publishedDate: string;
  coverPhoto?: string;
  tags?: string[];
};

export type TBlogComment = {
  dateTime: string;
  commentText: string;
};

export type TBlogReaction = {
  dateTime: string;
  reactionType: "like" | "unlike";
};
