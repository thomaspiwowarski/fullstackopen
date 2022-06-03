const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const app = require("../app");
const supertest = require("supertest");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "root",
      name: "Superuser",
      passwordHash,
    });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mock",
      name: "Mock User",
      password: "mockpassword",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username is already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "superuser",
      password: "mockpassword",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("creation fails with no username or password given", async () => {
    const noPasswordUser = {
      username: "nopassword",
      name: "nopassword",
    };

    const noPasswordResult = await api
      .post("/api/users")
      .send(noPasswordUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(noPasswordResult.body.error).toContain(
      "username or password is missing"
    );

    const noUsernameUser = {
      password: "nousername",
      name: "nousername",
    };

    const noUsernameResult = await api
      .post("/api/users")
      .send(noUsernameUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(noUsernameResult.body.error).toContain(
      "username or password is missing"
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
