import { configureStore } from '@reduxjs/toolkit';
import blogReducer from '../reducers/blogReducer';
import currentUserReducer from '../reducers/currentUserReducer';
import notificationReducer from '../reducers/notificationReducer';
import usersReducer from '../reducers/usersReducer';

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    currentUser: currentUserReducer,
    users: usersReducer,
  },
});
