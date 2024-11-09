const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
let users = require("./MOCK_DATA.json");
const { type } = require("os");

const app = express();
const PORT = 3000;
app.use(express.json());

//Mongo Db

//connection
mongoose
  .connect("mongodb+srv://admin:eZADpMHJQ4ILhOBI@cluster0.dwr8f.mongodb.net/yt")
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log("error", err));

//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

//Model
const User = mongoose.model("user", userSchema);

app.get("/api/users", async (req, res) => {
  const allUsers = await User.find({});
  res.setHeader("X-MyName", "Debraj Sarkar");
  return res.json(allUsers);
});

app.get("/api/users/:id", async (req, res) => {
  const findUserById = await User.findById(req.params.id);
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(findUserById);
});

app.post("/api/users", async (req, res) => {
  const body = req.body;
  // users.push({ id: users.length + 1, ...body });
  // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), async (err, data) => {
  //   return res.status(201).json({ msg: "Success" });
  // });
  const result = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    jobTitle: body.jobTitle,
    gender: body.gender,
  });

  console.log("result", result);

  return res.status(201).send({ msg: "Success" });
});

app.put("/api/users/:id", async (req, res) => {
  const body = req.params.id;
  let updatedData = req.body;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == body) {
      users[i] = { ...users[i], ...updatedData };
    }
  }
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {});

  const updateUser = await User.findByIdAndUpdate(body, {
    lastName: "changed",
  });
  return res.json({ msg: "Success" });
});

app.delete("/api/users/:id", async (req, res) => {
  const body = req.params.id;
  // let updatedUser = [];
  // for (let i = 0; i < users.length; i++) {
  //   if (users[i].id != body) {
  //     updatedUser.push(users[i]);
  //   }
  // }
  // users = updatedUser;
  // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
  //   return res.json({ msg: "Success" });
  // });
  const deleteUser = await User.findByIdAndDelete(body);
  return res.json({ msg: "Success" });
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
