import { useState, useEffect } from "react";

function App() {
  let [task, setTask] = useState("");
  let [id, setId] = useState("");
  let [array, setArray] = useState([]);
  let [editId, setEditId] = useState("");
  let [newTaskValue, setNewTaskValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((req) => req.json())
      .then((res) => {
        console.log(res);
        setArray(res);
      });
  }, []);

  console.log(newTaskValue);

  let postTask = (e) => {
    e.preventDefault();

    const newTask = {
      id: Number(id),
      task: task,
    };

    fetch("http://localhost:8000/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((req) => req.json())
      .then((res) => {
        setArray(newTask);
        console.log(res);
      });
    setTask("");
    setId("");
  };

  let editTask = (editId) => {
    fetch(`http://localhost:8000/list/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTaskValue }),
    })
      .then((req) => req.json())
      .then((res) => {
        setArray(
          array.map((i) => (i.id === editId ? { ...i, task: newTaskValue } : i))
        );
        setNewTaskValue("");
      });
  };

  let deleteTask = (deleteId) => {
    fetch(`http://localhost:8000/list/${deleteId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => {
        setArray(array.filter((_, item) => item.id !== deleteId));
      });
  };

  let deleteAllTasks = () => {
    fetch("http://localhost:8000/list",{
      method : "DELETE",
      headers : {"Content-Type" : "application/json"},
    })
      .then((res) => res.json())
      .then(() => {
        setArray([]);
      })
  }

  return (
    <>
      <main id="todolist">
        <h1>
          Todo List
          <span>Today I need To :</span>
        </h1>

        <form name="newform" onSubmit={postTask}>
          <input
            style={{ maxWidth: "80px", marginRight: "10px" }}
            type="text"
            name="id"
            placeholder="ID"
            value={id}
            required
            onChange={(e) => setId(e.target.value)}
          />

          <input
            value={task}
            type="text"
            name="newitem"
            id="newitem"
            placeholder="Enter your task here..."
            required
            onChange={(e) => setTask(e.target.value)}
          />

          <button type="submit">+</button>
        </form>

        <ul>
          {array.map((i) => (
            <li key={i.id}>
              {editId === i.id ? (
                <>
                  <input
                    className="edit-input"
                    value={newTaskValue}
                    onChange={(e) => setNewTaskValue(e.target.value)}
                    style={{ marginRight: "10px" }}
                  />
                  <button className="save-btn" onClick={() => editTask(i.id)}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span className="label">{i.task}</span>
                  <div className="actions">
                    <button
                      className="btn-picto"
                      type="button"
                      aria-label="Edit"
                      title="Edit"
                      onClick={() => {
                        setEditId(i.id);
                        setNewTaskValue(i.task);
                      }}
                    >
                      <i aria-hidden="true" className="material-icons">
                        edit
                      </i>
                    </button>

                    <button
                      className="btn-picto"
                      type="button"
                      aria-label="Delete"
                      title="Delete"
                      onClick={() => deleteTask(i.id)}
                    >
                      <i aria-hidden="true" className="material-icons">
                        delete
                      </i>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          style={{
            margin: "10px 0",
            background: "#FF6666",
            color: "white",
            padding: "20px 20px",
            border : "none"
          }}
          onClick={deleteAllTasks}
        >
          Delete All
        </button>
      </main>
    </>
  );
}

export default App;
