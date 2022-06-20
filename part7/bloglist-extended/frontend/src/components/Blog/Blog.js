import { useDispatch, useSelector } from 'react-redux/es/exports';
import { likeBlog, removeBlog, commentBlog } from '../../reducers/blogReducer';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const Blog = () => {
  const dispatch = useDispatch();
  const id = useParams().id;
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id));
  const loggedUser = useSelector((state) => state.currentUser.username);
  const [comment, setComment] = useState('');

  if (!blog) {
    return null;
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
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
      dispatch(likeBlog(blog.id, updateBlog));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) return;
    try {
      dispatch(removeBlog(blog.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    dispatch(commentBlog(blog.id, comment));
    setComment('');
  };

  return (
    <div>
      <div style={blogStyle} className="blog">
        <h2>{blog.title}</h2>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p>added by {blog?.user?.name}</p>
        {loggedUser === blog?.user?.username ? (
          <button onClick={handleRemove}>remove</button>
        ) : null}
      </div>
      <div>
        <h3>comments</h3>
        <input
          type="text"
          value={comment}
          name="comment"
          onChange={(event) => setComment(event.target.value)}
        />
        <button onClick={handleComment}>add comment</button>
        {blog.comments.length === 0 ? (
          <div>No comments</div>
        ) : (
          <ul>
            {blog.comments.map((comment) => (
              <li key={comment}>{comment}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Blog;
