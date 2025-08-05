const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

mongoose
  .connect("mongodb://localhost:27017/userDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const UserSchema = new mongoose.Schema({
  name: String,
});

const User = mongoose.model("User", UserSchema);

// Add Task
app.post("/add", async (req, res) => {
  const { name } = req.body;
  const user = new User({ name });
  await user.save();
  res.json({ message: "Task added!" });
});

// Get All Tasks
app.get("/tasks", async (req, res) => {
  const tasks = await User.find();
  res.json(tasks);
});

// Delete Task
app.delete("/remove/:id", async (req, res) => {
  await User.deleteOne({ _id: req.params.id });
  res.json({ message: "Task deleted!" });
});

// Update Task
app.put("/update/:id", async (req, res) => {
  const { name } = req.body;
  await User.updateOne({ _id: req.params.id }, { $set: { name: name } });
  res.json({ message: "Task updated!" });
});

// Delete All Tasks
app.delete("/removeAll", async (req, res) => {
  await User.deleteMany({});
  res.json({ message: "All tasks deleted!" });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
