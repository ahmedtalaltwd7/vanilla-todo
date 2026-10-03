// Select DOM elements
const todoForm = document.querySelector("form");
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

// Event listeners
document.addEventListener("DOMContentLoaded", renderTodos);
todoForm.addEventListener("submit", addTodo);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", todoClickHandler);
filterOption.addEventListener("change", filterTodo);

// ---- State helpers ----

// Todos are stored as objects: { text: string, completed: boolean }
function loadTodos() {
  try {
    const todos = JSON.parse(localStorage.getItem("todos"));
    return Array.isArray(todos) ? todos : [];
  } catch (err) {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeLocalTodo(todoElement) {
  const text = todoElement.querySelector(".todo-item").innerText;
  // Find the first *unfinished* match so duplicate texts delete correctly.
  const todos = loadTodos();
  const index = todos.findIndex(
    todo => todo.text === text && !todo.completed
  );
  if (index !== -1) todos.splice(index, 1);
  saveTodos(todos);
}

// ---- DOM builders ----

// Single source of truth for creating a todo element (no duplication).
function createTodoElement(text, completed) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  if (completed) todoDiv.classList.add("completed");

  const newTodo = document.createElement("li");
  newTodo.innerText = text; // innerText, not innerHTML -> no XSS
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);

  return todoDiv;
}

function renderTodos() {
  loadTodos().forEach(todo => {
    todoList.appendChild(createTodoElement(todo.text, todo.completed));
  });
  // Re-apply the current filter so restored items respect it.
  filterTodo({ target: filterOption });
}

// ---- Handlers ----

function addTodo(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text === "") return; // reject empty/whitespace-only input

  const todos = loadTodos();
  todos.push({ text, completed: false });
  saveTodos(todos);

  todoList.appendChild(createTodoElement(text, false));
  todoInput.value = "";
  todoInput.focus();
}

function todoClickHandler(e) {
  const item = e.target.closest("button");
  if (!item || !todoList.contains(item)) return;

  if (item.classList.contains("trash-btn")) {
    const todo = item.parentElement;
    todo.classList.add("fall");
    removeLocalTodo(todo);
    todo.addEventListener("transitionend", () => {
      todo.remove();
      // Re-apply filter after removal so counts stay consistent.
      filterTodo({ target: filterOption });
    });
  } else if (item.classList.contains("complete-btn")) {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    persistCompletionState();
  }
}

// Keep localStorage in sync with what's currently on screen.
function persistCompletionState() {
  const visible = Array.from(todoList.children).map(div => ({
    text: div.querySelector(".todo-item").innerText,
    completed: div.classList.contains("completed")
  }));
  saveTodos(visible);
}

function filterTodo(e) {
  const value = e.target.value;
  Array.from(todoList.children).forEach(todo => {
    switch (value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        todo.style.display = todo.classList.contains("completed")
          ? "flex"
          : "none";
        break;
      case "uncompleted":
        todo.style.display = todo.classList.contains("completed")
          ? "none"
          : "flex";
        break;
    }
  });
}
