const express = require("express");
const fs = require("fs");
let users = require("./MOCK_DATA.json");

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ id: users.length + 1, ...body });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ msg: "Success" });
  });
});

app.put("/api/users/:id", (req, res) => {
  const body = req.params.id;
  let updatedData = req.body;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == body) {
      users[i] = { ...users[i], ...updatedData };
    }
  }
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ msg: "Success" });
  });
});

app.delete("/api/users/:id", (req, res) => {
  const body = req.params.id;
  let updatedUser = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].id != body) {
      updatedUser.push(users[i]);
    }
  }
  users = updatedUser;
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ msg: "Success" });
  });
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
