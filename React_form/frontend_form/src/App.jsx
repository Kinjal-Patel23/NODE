import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [task, setTask] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      const newTask = { text: input, completed: false };
      setTask([...task, newTask]);
    }
    setInput("");
  };

  const handleCheck = (index) => {
    const updatedTask = task.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTask(updatedTask);
  };

  const handleDelete = (deleteIndex) => {
    const updateTask = task.filter((_, i) => i !== deleteIndex);
    setTask(updateTask);
  };

  const handleEdit = (index, currentText) => {
    setEditIndex(index);
    setEditText(currentText);
  };

  const handleSave = (index) => {
    if (editText.trim()) {
      const updated = [...task];
      updated[index].text = editText;
      setTask(updated);
      setEditIndex(null);
      setEditText("");
    }
  };

  const handleDeleteAll = () => {
    setTask([]);
  };

  const getFilteredTask = () => {
    if (filter === "completed") {
      return task.filter((t) => t.completed);
    } else if (filter === "pending") {
      return task.filter((t) => !t.completed);
    } else {
      return task;
    }
  };

  const checkedCount = task.filter((t) => t.completed).length;

  return (
    <div className="container">
      <h2 className="heading">Todo App</h2>

      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="task-input"
        />
        <button onClick={handleAdd} className="add-btn">
          Add
        </button>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <ul className="task-list">
        {getFilteredTask().map((t, i) => (
          <li key={i} className="task-item">
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => handleCheck(i)}
            />

            {editIndex === i ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                />
                <button onClick={() => handleSave(i)} className="save-btn">
                  Save
                </button>
              </>
            ) : (
              <>
                <span className={`task-text ${t.completed ? "completed" : ""}`}>
                  {t.text}
                </span>
                <i
                  className="fa-solid fa-pen-to-square icon-btn"
                  onClick={() => handleEdit(i, t.text)}
                ></i>
                <i
                  className="fa-solid fa-trash icon-btn"
                  onClick={() => handleDelete(i)}
                ></i>
              </>
            )}
          </li>
        ))}
      </ul>

      <button onClick={handleDeleteAll} className="delete-all-btn">
        Delete All
      </button>

      {filter === "all" && (
        <h1 className="counter">
          {checkedCount}/{task.length}
        </h1>
      )}
    </div>
  );
}

export default App;
