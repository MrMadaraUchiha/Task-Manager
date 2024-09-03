const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
const totalTasks = document.querySelector(".total-tasks span");
const completedTasks = document.querySelector(".completed-tasks span");
const remainingTasks = document.querySelector(".remaining-tasks span")
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
    tasks.map((task) => {
        createTask(task);
    });
}

// submeter form
todoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = this.name;
    const inputValue = input.value;

    if (inputValue != "") {
        const task = {
            id: new Date().getTime(),
            name: inputValue,
            isCompleted: false
        };

        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        createTask(task);
        todoForm.reset();
    }

    input.focus();

});

// remove tarefa
todoList.addEventListener("click", (e) => {
    if (
        e.target.classList.contains("remove-task") ||
        e.target.parentElement.classList.contains("remove-task")
    ) {
        const taskId = e.target.closest("li").id;
        removeTask(taskId);
    }
});

// atualiza tarefas
todoList.addEventListener("input", (e) => {
    const taskId = e.target.closest("li").id;
    updateTask(taskId, e.target);
});

todoList.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
    }
});

// cria tarefas
function createTask(task) {
    const taskEl = document.createElement("li");
    taskEl.setAttribute("id", task.id);
    const taskElMarkup = `
        <div class="checkbox-wrapper">
            <input type="checkbox" id="${task.name}-${task.id}" name="tasks" ${task.isCompleted ? "checked" : ""
        }>
            <label for="${task.name}-${task.id}">
                <svg class="checkbox-empty">
                    <use xlink:href="#checkbox_empty"></use> 
                </svg>
                <svg class="checkmark">
                    <use xlink:href="#checkmark"></use>
                </svg>
            </label>
            <span ${!task.isCompleted ? "contenteditable" : ""}>${task.name}</span>
        </div>
        <button class="remove-task" title="Remove ${task.name} task">
            <svg>
                <use xlink:href="#close"></use> 
            </svg>
        </button>
    `;

    taskEl.innerHTML = taskElMarkup;
    todoList.appendChild(taskEl);
    countTasks();
}

// remove tarefas
function removeTask(taskId) {
    tasks = tasks.filter((task) => task.id !== parseInt(taskId));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById(taskId).remove();
    countTasks();
}

// atualiza tarefas
function updateTask(taskId, el) {
    const task = tasks.find((task) => task.id === parseInt(taskId));

    if (el.hasAttribute("contentEditable")) {
        task.name = el.textContent;
    } else {
        const span = el.nextElementSibling.nextElementSibling;
        task.isCompleted = !task.isCompleted;

        if (task.isCompleted) {
            span.removeAttribute("contenteditable");
            el.setAttribute("checked", "");
        } else {
            el.removeAttribute("checked");
            span.setAttribute("contenteditable", "");
        }
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    countTasks();
}

function countTasks() {
    totalTasks.textContent = tasks.length;
    const completedTasksArray = tasks.filter((task) => task.isCompleted === true);
    completedTasks.textContent = completedTasksArray.length;
    remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

