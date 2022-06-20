import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const BlogsList = () => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <ul>
      {blogs.map((blog) => (
        <Link key={blog.id} to={`/blogs/${blog.id}`}>
          <li
            style={{
              paddingTop: 10,
              paddingLeft: 2,
              border: 'solid',
              borderWidth: 1,
              marginBottom: 5,
            }}
          >
            {blog.title}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default BlogsList;
