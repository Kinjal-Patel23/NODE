const express = require("express");
const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname));

let todos = [];

app.get("/", (req, res) => {
    res.render("add", { message: null });
});

//  add task
app.post("/add-task", (req, res) => {
    let { id, task } = req.body;
    id = Number(id);
    todos.push({ id, task });
    res.render("add", { message: "Task added successfully!" });
});

// task list
app.get("/list", (req, res) => {
    res.render("list", { todos });
});

// edit
app.get("/edit/:index", (req, res) => {
    const index = req.params.index;
    const todo = todos[index];

    res.render("edit", { todo, index });
    
});

// update
app.post("/edit/:index", (req, res) => {
    const index = req.params.index;
    const { id, task } = req.body;

    todos[index] = { id: Number(id), task };
    res.redirect("/list");
});

// delete
app.post("/delete/:index", (req, res) => {
    const index = req.params.index;
    todos.splice(index, 1);
    res.redirect("/list");
});

app.post("/delete-all", (req, res) => {
    todos = [];
    res.redirect("/list");
});


app.listen(port)
