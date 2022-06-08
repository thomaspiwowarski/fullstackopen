import { useState, useEffect, useRef } from "react";
import LoginForm from "./components/LoginForm";
import Blog from "./components/Blog/Blog";
import blogService from "./services/blogs";
import BlogForm from "./components/BlogForm/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const blogs = async () => {
      try {
        const response = await blogService.getAll();
        setBlogs(
          response.sort((a, b) => {
            return b.likes - a.likes;
          })
        );
      } catch (error) {
        console.error(error);
      }
    };
    blogs();
  }, [user]);

  const sendMessage = (err, msg) => {
    setMessage({
      error: err,
      content: msg,
    });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleAddNewBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      sendMessage(
        false,
        `a new blog ${blogObject.title} by ${blogObject.author} added`
      );
    } catch (error) {
      sendMessage(true, error.message);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  if (user === null) return <LoginForm setUser={setUser} />;
  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      {message !== null ? <Notification message={message} /> : null}
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm handleAddNewBlog={handleAddNewBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          blogs={blogs}
          setBlogs={setBlogs}
          loggedUser={user.username}
        />
      ))}
    </div>
  );
};

export default App;
