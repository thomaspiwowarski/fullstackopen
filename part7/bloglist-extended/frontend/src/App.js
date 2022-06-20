import { useEffect, useRef } from 'react';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog/Blog';
import blogService from './services/blogs';
import BlogForm from './components/BlogForm/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { initializeBlogs, createBlog } from './reducers/blogReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import { setUser } from './reducers/currentUserReducer';
import { initializeUsers } from './reducers/usersReducer';
import UsersList from './components/UsersList';
import User from './components/User';
import { Routes, Route, Link } from 'react-router-dom';
import BlogsList from './components/BlogsList';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentUser);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, [dispatch, user]);

  const handleAddNewBlog = async (blogObject) => {
    try {
      dispatch(createBlog(blogObject));
      dispatch(
        setNotification(
          `a new blog ${blogObject.title} by ${blogObject.author} added`,
          false,
          5
        )
      );
    } catch (error) {
      dispatch(setNotification(error.message, true, 5));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(setUser(null));
  };

  if (user === null) return <LoginForm />;
  return (
    <div>
      <h2>blogs</h2>
      <div
        style={{
          backgroundColor: 'rgb(168,168,168)',
          marginTop: 10,
          marginBottom: 10,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <Link style={{ padding: 5 }} to="/">
          blogs
        </Link>
        <Link style={{ padding: 5 }} to="/users">
          users
        </Link>
        <em>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </em>
      </div>
      <Notification />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm handleAddNewBlog={handleAddNewBlog} />
      </Togglable>
      <Routes>
        <Route path="/" element={<BlogsList />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  );
};

export default App;
