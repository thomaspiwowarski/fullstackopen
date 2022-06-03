const mongoose = require("mongoose");
const Blog = require("../models/blogs");
const helper = require("./test_helper");
const app = require("../app");
const supertest = require("supertest");

const api = supertest(app);

describe("when there is initially some blogs saved", () => {
  let headers;
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "sekret",
    };

    await api.post("/api/users").send(newUser);

    const result = await api.post("/api/login").send(newUser);

    headers = { Authorization: `bearer ${result.body.token}` };
  });

  test("blogs are returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .set(headers)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs").set(headers);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs").set(headers);
    expect(response.body[0].id).toBeDefined();
  });

  describe("addition of a new blog", () => {
    test("new blog post is created", async () => {
      const newBlog = {
        title: "mock blog",
        author: "mock author",
        url: "http://mock.test",
        likes: 12,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set(headers)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

      const contents = blogsAtEnd.map((b) => b.title);
      expect(contents).toContain("mock blog");
    });

    test("with likes missing will set it to 0", async () => {
      const newBlog = {
        title: "mock blog with missing likes",
        author: "mock blog with missing likes",
        url: "http://missinglikes.test",
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set(headers)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const addedBlog = await Blog.findOne({ title: newBlog.title });
      expect(addedBlog.likes).toEqual(0);
    });

    test("with title or url missing will pursue to status 400", async () => {
      const newBlogMissingTitle = {
        author: "mock author without title",
        url: "http://missingtitle.test",
        likes: 12,
      };

      const newBlogMissingUrl = {
        author: "mock author without url",
        title: "mock blog with missing url",
        likes: 12,
      };

      await api
        .post("/api/blogs")
        .send(newBlogMissingTitle)
        .set(headers)
        .expect(400);
      await api
        .post("/api/blogs")
        .send(newBlogMissingUrl)
        .set(headers)
        .expect(400);
    });

    test("without token fails", async () => {
      const newBlog = {
        title: "mock blog",
        author: "mock author",
        url: "http://mock.test",
        likes: 12,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const blogsAtTheEnd = await helper.blogsInDb();
      expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length);
    });

    test("with invalid token fails", async () => {
      const newBlog = {
        title: "mock blog",
        author: "mock author",
        url: "http://mock.test",
        likes: 12,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `bearer x${headers.Authorization.substring(1)}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const blogsAtTheEnd = await helper.blogsInDb();
      expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const newBlog = {
        title: "mock blog",
        author: "mock author",
        url: "http://mock.test",
        likes: 12,
      };

      const result = await api
        .post("/api/blogs")
        .send(newBlog)
        .set(headers)
        .expect(201)
        .expect("Content-Type", /application\/json/);
      const h = JSON.parse(result.text);
      const blogToDelete = h.id;
      const blogsAtStart = await helper.blogsInDb();

      await api.delete(`/api/blogs/${blogToDelete}`).set(headers).expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

      const contents = blogsAtEnd.map((b) => b.title);
      expect(contents).not.toContain(blogToDelete.title);
    });

    test("fails with invalid id", async () => {
      await api
        .delete(`/api/blogs/${142353253}`)
        .set(headers)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });

    test("fails without token", async () => {
      const blogsBefore = await Blog.countDocuments();

      await api.delete(`/api/blogs/${helper.initialBlogs[0]._id}`).expect(401);

      const blogsAfter = await Blog.countDocuments();

      expect(blogsBefore - blogsAfter).toEqual(0);
    });

    test("fails with invalid token", async () => {
      const blogsBefore = await Blog.countDocuments();

      await api
        .delete(`/api/blogs/${helper.initialBlogs[1]._id}`)
        .set("Authorization", `bearer x${131523634745}`)
        .expect(401);

      const blogsAfter = await Blog.countDocuments();

      expect(blogsBefore - blogsAfter).toEqual(0);
    });

    test("with valid token that is not the author's token fails", async () => {
      const blogsAtStart = await helper.blogsInDb();

      await api
        .delete(`/api/blogs/${helper.initialBlogs[0]._id}`)
        .set(headers)
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    });
  });

  describe("update of a blog", () => {
    test("succeeds with valid id", async () => {
      const blogToUpdate = helper.initialBlogs[0]._id;
      const likes = 200;

      await api
        .put(`/api/blogs/${blogToUpdate}`)
        .send({ likes })
        .set(headers)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogAtEnd = await Blog.findById(blogToUpdate);
      expect(blogAtEnd.likes).toEqual(likes);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
