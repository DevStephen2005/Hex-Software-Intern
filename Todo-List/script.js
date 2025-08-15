document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const filterButtons = document.querySelectorAll(".filter-buttons button");
  const clearCompletedBtn = document.getElementById("clearCompleted");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    let filteredTasks = tasks;

    if (filter === "active") {
      filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === "completed") {
      filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";

      const taskSpan = document.createElement("span");
      taskSpan.textContent = task.text;
      taskSpan.onclick = () => toggleTask(index);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✖";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.onclick = () => deleteTask(index);

      li.appendChild(taskSpan);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      saveTasks();
      renderTasks(getActiveFilter());
      taskInput.value = "";
    }
  }

  function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks(getActiveFilter());
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(getActiveFilter());
  }

  function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks(getActiveFilter());
  }

  function getActiveFilter() {
    return document.querySelector(".filter-buttons button.active").dataset.filter;
  }

  addBtn.onclick = addTask;
  taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
  });

  clearCompletedBtn.onclick = clearCompleted;

  filterButtons.forEach(btn => {
    btn.onclick = () => {
      document.querySelector(".filter-buttons button.active").classList.remove("active");
      btn.classList.add("active");
      renderTasks(btn.dataset.filter);
    };
  });

  renderTasks();
});
