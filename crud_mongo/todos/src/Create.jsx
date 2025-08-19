import React, { useState, useRef } from "react";
import axios from "axios";

const Create = ({ onTaskAdded }) => {
  const [task, setTask] = useState("");
  const inputRef = useRef(null);

  const handleAdd = (e) => {
    if (!task.trim()) return;
    axios
      .post("http://localhost:5000/add", { task })
      .then((res) => {
        onTaskAdded(res.data.task);
        setTask("");
        inputRef.current.focus();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="task-form-container">
      <form
        className="task-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <input
          ref={inputRef}
          className="task-input"
          type="text"
          placeholder="Enter your task..."
          onChange={(e) => setTask(e.target.value)}
          value={task}
        />
        <button className="add-btn" type="submit">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default Create;
