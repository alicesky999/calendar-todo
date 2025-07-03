const calendarGrid = document.getElementById("calendarGrid");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const selectedDateDisplay = document.getElementById("selectedDate");
const todoList = document.getElementById("todoList");
const todoInput = document.getElementById("todoInput");
const addTodo = document.getElementById("addTodo");

let currentDate = new Date();
let todos = JSON.parse(localStorage.getItem("todoData")) || {};

function saveTodos() {
  localStorage.setItem("todoData", JSON.stringify(todos));
}

function checkTaiwanHoliday(month, day) {
  const holidays = {
    "1-1": "元旦",
    "2-28": "和平紀念日",
    "4-4": "兒童節",
    "4-5": "清明節",
    "5-1": "勞動節",
    "10-10": "國慶日"
  };
  const key = `${month}-${day}`;
  return holidays[key] || null;
}

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  monthYear.textContent = `${year} 年 ${month + 1} 月`;
  calendarGrid.innerHTML = "";

  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  weekdays.forEach(day => {
    const header = document.createElement("div");
    header.className = "calendar-weekday";
    header.textContent = day;
    calendarGrid.appendChild(header);
  });

  const startDay = firstDay.getDay();

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    calendarGrid.appendChild(empty);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const day = document.createElement("div");
    const thisDate = new Date(year, month, d);
    const dayOfWeek = thisDate.getDay();
    const dateKey = `${year}-${month + 1}-${d}`;

    day.className = "calendar-day";

    if (dayOfWeek === 0) day.classList.add("sunday");
    else if (dayOfWeek === 6) day.classList.add("saturday");
    else day.classList.add("weekday");

    // 今天高亮
    const today = new Date();
    if (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === d
    ) {
      day.classList.add("today");
    }

    // 假日標註
    const isHoliday = checkTaiwanHoliday(month + 1, d);
    if (isHoliday) {
      day.classList.add("holiday");
      day.title = isHoliday;
    }

    day.textContent = d;
    day.addEventListener("click", () => {
      showTodos(dateKey);
    });
    calendarGrid.appendChild(day);
  }
}

function showTodos(dateKey) {
  selectedDateDisplay.textContent = `📅 ${dateKey}`;
  todoList.innerHTML = "";

  const items = todos[dateKey] || [];
  items.forEach((text, index) => {
    const item = document.createElement("div");
    item.className = "todo-item";
    item.draggable = true;
    item.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✘";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => {
      items.splice(index, 1);
      todos[dateKey] = items;
      saveTodos();
      showTodos(dateKey);
    };

    item.appendChild(deleteBtn);

    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
    });

    todoList.appendChild(item);
  });

  todoList.ondragover = (e) => e.preventDefault();
  todoList.ondrop = (e) => {
    const draggedIndex = e.dataTransfer.getData("text/plain");
    const draggedItem = items.splice(draggedIndex, 1)[0];
    items.push(draggedItem);
    todos[dateKey] = items;
    saveTodos();
    showTodos(dateKey);
  };

  addTodo.onclick = () => {
    const text = todoInput.value.trim();
    if (!text) return;
    todos[dateKey] = todos[dateKey] || [];
    todos[dateKey].push(text);
    todoInput.value = "";
    saveTodos();
    showTodos(dateKey);
  };
}

prevMonth.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

nextMonth.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

renderCalendar(currentDate);
