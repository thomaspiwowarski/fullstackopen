import { useState } from "react";

const BlogForm = ({ handleAddNewBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const formHandler = (event) => {
    event.preventDefault();
    handleAddNewBlog({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={formHandler}>
      <div>
        title:{" "}
        <input
          type='text'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder='title'
          id='title'
        />
      </div>
      <div>
        author:{" "}
        <input
          type='text'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='author'
          id='author'
        />
      </div>
      <div>
        url:{" "}
        <input
          type='text'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder='url'
          id='url'
        />
      </div>
      <button type='submit'>add blog</button>
    </form>
  );
};

export default BlogForm;
