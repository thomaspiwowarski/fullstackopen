import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (id, blog) => {
  return async (dispatch) => {
    await blogService.addLike(id, blog);
    dispatch(incrementLike(id));
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.removeBlog(id);
    dispatch(remove(id));
  };
};

export const commentBlog = (id, content) => {
  return async (dispatch) => {
    await blogService.addComment(id, content);
    dispatch(comment({ id, content }));
  };
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    incrementLike(state, action) {
      const id = action.payload;
      const blogToLike = state.find((blog) => blog.id === id);
      const changedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
      };
      return state.map((blog) => (blog.id !== id ? blog : changedBlog));
    },
    remove(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
    comment(state, action) {
      const id = action.payload.id;
      const blogToComment = state.find((blog) => blog.id === id);
      const changedBlog = {
        ...blogToComment,
        comments: blogToComment.comments.concat(action.payload.content),
      };
      return state.map((blog) => (blog.id !== id ? blog : changedBlog));
    },
  },
});

export const { setBlogs, appendBlog, incrementLike, remove, comment } =
  blogSlice.actions;
export default blogSlice.reducer;
