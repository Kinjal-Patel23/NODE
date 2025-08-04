const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors());
app.use(express.json());

let todoTask = [
    {
        id : 1,
        task : "blog"
    }
]

app.get("/list" , (req, res) => {
    res.json(todoTask);
})

app.post("/list" , (req, res) => {
    let data = req.body;
    todoTask.push(data);
    console.log(data)
})

app.patch("/list/:id", (req, res) => {
   const id = Number(req.params.id);
   const updatedTask = req.body.task; 
   console.log(updatedTask);

todoTask = todoTask.map((i) =>
  i.id === id ? {...i, task: updatedTask } : i
);

})

app.delete("/list/:id", (req, res) => {
  const id = Number(req.params.id);
  todoTask = todoTask.filter((t) => t.id !== id);
});

app.delete("/list", (req, res) => {
  todoTask = [];
})


app.listen(8000);