const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!(username && password))
    return response
      .status(400)
      .send({ error: "username or password is missing" });

  if (password.length < 3)
    return response
      .status(400)
      .send({ error: "password must be atleast 3 characters long" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    name,
    passwordHash,
  });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.status(200).json(users);
});

module.exports = userRouter;
