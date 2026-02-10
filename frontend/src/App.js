import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  // ======================
  // BASIC API FUNCTIONS
  // ======================

  const fetchTodos = () => {
    fetch("http://localhost:5000/api/todos")
      .then(res => res.json())
      .then(data => setTodos(data));
  };

  const addTodo = () => {
    if (!title) {
      alert("Title is required");
      return;
    }

    fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, description })
    }).then(() => {
      setTitle("");
      setDescription("");
      fetchTodos();
    });
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE"
    }).then(() => fetchTodos());
  };

  const toggleStatus = (todo) => {
    fetch(`http://localhost:5000/api/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: todo.status === "Pending" ? "Completed" : "Pending"
      })
    }).then(() => fetchTodos());
  };

  // ======================
  // ⭐ OPTIONAL STEP 2
  // FILTER TODOS BY STATUS
  // ======================
  const filterTodos = (status) => {
    fetch("http://localhost:5000/api/todos")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(todo => todo.status === status);
        setTodos(filtered);
      });
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px"
    }}>
      <h2>Todo List</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={addTodo}>Add Todo</button>

      <hr />

      {/* ======================
          ⭐ OPTIONAL STEP 1
          FILTER BUTTONS UI
         ====================== */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={fetchTodos}>All</button>{" "}
        <button onClick={() => filterTodos("Pending")}>Pending</button>{" "}
        <button onClick={() => filterTodos("Completed")}>Completed</button>
      </div>

      {todos.length === 0 && <p>No todos found</p>}

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <strong>{todo.title}</strong> – {todo.status}{" "}
            <button onClick={() => toggleStatus(todo)}>
              {todo.status === "Pending" ? "Complete" : "Pending"}
            </button>{" "}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
