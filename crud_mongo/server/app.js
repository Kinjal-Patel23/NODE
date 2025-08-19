const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const todoModels = require("./model/todoModel");
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/tododb")
    .then(() => console.log("Database connected successfully...!!"))
    .catch((err) => console.error("Database connection error", err));

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
})

app.post("/add", (req, res) => {
    const task = req.body.task;
    todoModels.create({ task, important: false })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error("Error", err);
        })
})

app.get("/todos", (req, res) => {
    todoModels.find()
        .then((todos) => {
            res.json(todos);
        })
        .catch((err) => {
            console.error("Error", err);
        })
})

app.get("/todos/important", (req, res) => {
    todoModels.find({ important: true })
        .then((todos) => res.json(todos))
        .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/todos/today", (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    todoModels.find({
        createdAt: {
            $gte: today,
            $lt: tomorrow
        }
    })
    .then((todos) => res.json(todos))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/todos/week", (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    todoModels.find({
        createdAt: {
            $gte: today,
            $lt: nextWeek
        }
    })
    .then((todos) => res.json(todos))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.put("/todos/:id/important", (req, res) => {
    todoModels.findById(req.params.id)
        .then((todo) => {
            todo.important = !todo.important;
            return todo.save();
        })
        .then((updatedTodo) => res.json(updatedTodo))
        .catch((err) => res.status(400).json("Error: " + err));
});

app.put("/todos/:id", (req, res) => {
    const id = req.params.id;
    const updateTask = req.body.task;
    todoModels.updateOne({_id : id}, {task : updateTask})
    .then(() => {
        res.json({message : "Task updated successfully"});
    })
    .catch((err) => {
        console.error(err);
    })
})

app.delete("/todos/:id", (req, res) => {
    const id = req.params.id;
    todoModels.deleteOne({_id : id})
    .then(() => {
        res.json({message : "Task deleted successfully"});
    })
    .catch((err) => {
        console.error("Error", err);
    })
})

app.delete("/todos", (req, res) => {
    todoModels.deleteMany({})
    .then(() => res.send({message : "All todos deleted successfully"}))
    .catch((err) =>  console.log(err));
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})