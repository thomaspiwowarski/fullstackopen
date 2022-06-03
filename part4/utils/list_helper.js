const morgan = require("morgan");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, ele) => sum + ele.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs.length) return {};

  const { title, author, likes } = blogs.reduce(
    (fav, ele) => (ele.likes > fav.likes ? ele : fav),
    blogs[0]
  );

  return { title, author, likes };
};

const mostBlogs = (blogs) => {
  if (!blogs.length) return {};

  const blogsArray = [];

  blogs.forEach(({ author }) => {
    const obj = blogsArray.find((a) => a.author === author);
    if (obj) {
      obj.blogs = obj.blogs + 1;
    } else {
      blogsArray.push({ author, blogs: 1 });
    }
  });

  return blogsArray.reduce((prev, author) =>
    author.blogs > prev.blogs ? author : prev
  );
};

const mostLikes = (blogs) => {
  if (!blogs.length) return {};

  const likesArray = [];

  blogs.forEach(({ author, likes }) => {
    const obj = likesArray.find((a) => a.author === author);
    if (obj) {
      obj.likes = obj.likes + likes;
    } else {
      likesArray.push({ author, likes });
    }
  });

  return likesArray.reduce((prev, author) =>
    author.likes > prev.likes ? author : prev
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
