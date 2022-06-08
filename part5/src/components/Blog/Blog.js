import { useState } from "react";
import blogService from "../../services/blogs";
import PropTypes from "prop-types";

const Blog = ({ blog, blogs, setBlogs, loggedUser, handlerForTest }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  let handleLike = async () => {
    try {
      const updateBlog = {
        user: blog?.user?.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      };
      const response = await blogService.addLike(blog.id, updateBlog);
      blog.likes = response.likes;
      setLikes(response.likes);
    } catch (error) {
      console.error(error);
    }
  };

  if (handlerForTest) {
    handleLike = handlerForTest;
  }

  const handleRemove = async () => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) return;
    try {
      await blogService.removeBlog(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}{" "}
      <button onClick={() => setShowInfo(!showInfo)}>
        {showInfo ? "hide" : "view"}
      </button>
      {showInfo ? (
        <>
          <p>{blog.url}</p>
          <p>
            likes {likes} <button onClick={handleLike}>like</button>
          </p>
          <p>{blog?.user?.name}</p>
          {loggedUser === blog?.user?.username ? (
            <button onClick={handleRemove}>remove</button>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  setBlogs: PropTypes.func.isRequired,
  loggedUser: PropTypes.string.isRequired,
};

export default Blog;
