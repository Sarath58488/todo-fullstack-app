const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let todos = [];
let idCounter = 1;

app.post("/api/todos", (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTodo = {
    id: idCounter++,
    title,
    description: description || "",
    status: "Pending",
    createdAt: new Date()
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.get("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, status } = req.body;

  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  if (title) todo.title = title;
  if (description) todo.description = description;
  if (status) todo.status = status;

  res.json(todo);
});
app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todos.splice(index, 1);
  res.json({ message: "Todo deleted successfully" });
});

