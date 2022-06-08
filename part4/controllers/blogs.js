const blogsRouter = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.status(200).json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.title || !request.body.url)
    return response.status(400).end();

  const { user } = request;

  const blog = new Blog({
    ...request.body,
    likes: request.body.likes ? request.body.likes : 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog?.user?.toString() !== request.user._id.toString()) {
    return response
      .status(401)
      .json({ error: "you do not have permission to delete this blog" });
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const blog = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  console.log(updatedBlog);
  response.json(updatedBlog);
});

module.exports = blogsRouter;
