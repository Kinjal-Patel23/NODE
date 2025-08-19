import React, { useEffect, useState } from "react";
import axios from "axios";

const View = ({ reload, activeTab }) => {
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    let endpoint = "http://localhost:5000/todos";

    if (activeTab === "important") {
      endpoint = "http://localhost:5000/todos/important";
    } else if (activeTab === "today") {
      endpoint = "http://localhost:5000/todos/today";
    } else if (activeTab === "week") {
      endpoint = "http://localhost:5000/todos/week";
    }

    axios
      .get(endpoint)
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => {
        console.error("Error fetching todos:", err);
      });
  }, [reload, activeTab]);

  const handleEdit = (id, currentTask) => {
    setEditId(id);
    setEditText(currentTask);
  };

  const handleSave = (id) => {
    if (editText.trim() !== "") {
      axios
        .put(`http://localhost:5000/todos/${id}`, { task: editText })
        .then(() => {
          setTodos(
            todos.map((todo) =>
              todo._id === id ? { ...todo, task: editText } : todo
            )
          );
          setEditId(null);
          setEditText("");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/todos/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleToggleImportant = (id) => {
    axios
      .put(`http://localhost:5000/todos/${id}/important`)
      .then((res) => {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, important: res.data.important } : todo
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDeleteAll = () => {
    axios
      .delete("http://localhost:5000/todos")
      .then(() => {
        setTodos([]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "important":
        return "Important Tasks";
      case "today":
        return "Today's Tasks";
      case "week":
        return "This Week's Tasks";
      default:
        return "All Tasks";
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="todos-container">
      <div className="todos-header">
        <h2>{getTabTitle()}</h2>
        <span className="todos-count">{todos.length} tasks</span>
      </div>

      {todos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p>No tasks found. Add a new task to get started!</p>
        </div>
      ) : (
        <>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo._id} className="todo-item">
                {editId === todo._id ? (
                  <>
                    <input
                      className="edit-input"
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="todo-actions">
                      <button
                        className="save-btn"
                        onClick={() => handleSave(todo._id)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="todo-content">
                      <button
                        className={`important-btn ${
                          todo.important ? "active" : ""
                        }`}
                        onClick={() => handleToggleImportant(todo._id)}
                        title={
                          todo.important
                            ? "Mark as important"
                            : "Mark as not important"
                        }
                      >
                        ⭐
                      </button>
                      <div className="todo-details">
                        <span className="todo-text">{todo.task}</span>
                        <span className="todo-date">
                          {formatDate(todo.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="todo-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(todo._id, todo.task)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(todo._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          <div>
            <button className="delete-all-btn" onClick={handleDeleteAll}>
              Delete All Tasks
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default View;
