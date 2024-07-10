const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const dueDateInput = document.getElementById('due-date-input');
const prioritySelect = document.getElementById('priority-select');
const categorySelect = document.getElementById('category-select');
const priorityFilter = document.getElementById('priority-filter');
const todoList = document.getElementById('todo-list');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const task = input.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;
  const category = categorySelect.value;
  if (task !== '') {
    addTask(task, dueDate, priority, category);
    input.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'low';
    categorySelect.value = 'all';
  }
});

function addTask(task, dueDate, priority, category) {
  const li = document.createElement('li');
  li.textContent = task;
  li.dataset.dueDate = dueDate;
  li.dataset.priority = priority;
  li.dataset.category = category;
  li.addEventListener('click', toggleTask);
  todoList.appendChild(li);

  // Set task reminder
  if (dueDate !== '') {
    const reminderDate = new Date(dueDate);
    const now = new Date();
    if (reminderDate > now) {
      const timeDifference = reminderDate.getTime() - now.getTime();
      setTimeout(() => {
        showReminder(task);
      }, timeDifference);
    }
  }
}

function toggleTask(event) {
  const li = event.target;
  li.classList.toggle('completed');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = li.classList.contains('completed');
  checkbox.classList.add('task-checkbox');
  li.prepend(checkbox);
}

function filterTasks(category, priority) {
  const tasks = todoList.querySelectorAll('li');
  tasks.forEach(function(task) {
    const taskCategory = task.dataset.category;
    const taskPriority = task.dataset.priority;
    if ((category === 'all' || taskCategory === category) && (priority === 'all' || taskPriority === priority)) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}

function showReminder(task) {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Task Reminder', {
      body: task,
      icon: 'https://example.com/path/to/notification-icon.png' // Replace with the actual web URL of your notification icon
    });
  }
}

// Request permission for notifications
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

categorySelect.addEventListener('change', function() {
  const selectedCategory = categorySelect.value;
  filterTasks(selectedCategory, priorityFilter.value);
});

priorityFilter.addEventListener('change', function() {
  const selectedPriority = priorityFilter.value;
  filterTasks(categorySelect.value, selectedPriority);
});
// Task Completion Statistics
function updateStatistics() {
  const tasks = todoList.querySelectorAll('li');
  const completedTasks = todoList.querySelectorAll('li.completed');
  const pendingTasks = tasks.length - completedTasks.length;
  const completionPercentage = Math.round((completedTasks.length / tasks.length) * 100);

  // Update statistics display
  const statisticsElement = document.getElementById('statistics');
  statisticsElement.textContent = `Completed: ${completedTasks.length} | Pending: ${pendingTasks} | Completion: ${completionPercentage}%`;
}

// Call the functions to initialize the app
filterTasks(categorySelect.value, priorityFilter.value);
applyPriorityColors();
updateStatistics();        