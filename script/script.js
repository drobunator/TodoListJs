
//Добавляю пустой объект
const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : {};
localStorage.setItem('tasks', JSON.stringify(tasks));
const objectTasks = JSON.parse(localStorage.getItem('tasks'));

const textForm = document.querySelector(".text-form");
const addTaskButton = document.querySelector(".add-task");
const ulList = document.querySelector(".task-list");
const searchInput = document.querySelector(".search-input");
const fragment = document.createDocumentFragment();
const impValue = document.querySelector(".important-value");
const impNumUp = document.querySelector(".important-up");
const impNumDown = document.querySelector(".important-down");
const btnSortText = document.querySelector(".sort-btn_text");
const importantForm = document.querySelector(".important-container");
const form = document.querySelector(".form");
const btnSortCompl = document.querySelector(".sort-btn_completed");
const sortImportantBtn = document.querySelector(".sort-btn_important");
const sortBtnDate = document.querySelector(".sort-btn_date");



function pushChangeLocalStor(objectTasks){
  const taskObj = JSON.stringify(objectTasks);
  localStorage.setItem('tasks', taskObj);
}

//Функция добавления задач
function renderTask(objectTasks) {
  Object.values(objectTasks).reverse().forEach(task => {
    const li = createTask(task);
    fragment.appendChild(li);
    ulList.appendChild(fragment);
  });
}
renderTask(objectTasks);




  //Нажатие на кнопку addTask
  addTaskButton.addEventListener("click", ev => {
    evClickTaskData();
    ev.preventDefault();
  });
  //Нажатие на клавишу Enter
  const addForm = document.querySelector(".form");
  addForm.addEventListener("keydown", ev => {
    if (ev.keyCode !== 13) return;
    ev.preventDefault();
    evClickTaskData();
  });


function evClickTaskData() {
  const formText = textForm.value;
  if (!formText) return modalAlert("Enter your text!!!");
  const task = addTaskData(formText, objectTasks);
  const li = createTask(task);
  
  ulList.insertAdjacentElement("afterbegin", li);
  importantForm.reset();
  form.reset();
}


//Конструктор задачи
function addTaskData(formText, objectTasks ) {
  
  const nowDate = Date.now();
  const newTask = {
    id: `task-${Date.now() * 100}`,
    completed: false,
    text: formText,
    date: nowDate,
    important: impValue.value
  };
  objectTasks[newTask.id] = newTask;
  pushChangeLocalStor(objectTasks);
  return newTask;
}

//Форма по важности
  impNumUp.addEventListener("click", ev => {
    ev.preventDefault();
    if (impValue.value < 5) impValue.value++;
  });
  impNumDown.addEventListener("click", ev => {
    ev.preventDefault();
    if (impValue.value > 0) impValue.value--;
  });


function deleteTag(tags) {
  if (!tags) return;
  tags.forEach(tag => tag.remove());
}

//Сортировка текста  
btnSortText.setAttribute("data-flag", "true");

btnSortText.addEventListener("click", () => {
  const allLi = document.querySelectorAll(".task");
  deleteTag(allLi);
  if (btnSortText.dataset.flag === "true") {
    btnSortText.dataset.flag = "false";
    sortText("min");
  } else if (btnSortText.dataset.flag === "false") {
    btnSortText.dataset.flag = "true";
    sortText("max");
  }
});

function sortText(value) {
  if (value === "min") {
    const sortMin = Object.values(objectTasks).sort((prev, next) => {
      return prev.text < next.text ? 1 : prev.text > next.text ? -1 : 0;
    });
    renderTask(sortMin);
  } else if (value === "max") {
    const sortMax = Object.values(objectTasks).sort((prev, next) => {
      return prev.text > next.text ? 1 : prev.text < next.text ? -1 : 0;
    });
    renderTask(sortMax);
  }
}

//Сортировка по выполнености

btnSortCompl.setAttribute("data-flag", "true");

btnSortCompl.addEventListener("click", () => {
  const allLi = document.querySelectorAll(".task");
  deleteTag(allLi);
  if (btnSortCompl.dataset.flag === "true") {
    btnSortCompl.dataset.flag = "false";
    sortNum("min", "completed");
  } else if (btnSortCompl.dataset.flag === "false") {
    btnSortCompl.dataset.flag = "true";
    sortNum("max", "completed");
  }
});

//Сортировка по важности

sortImportantBtn.setAttribute("data-flag", "true");

sortImportantBtn.addEventListener("click", ev => {
  const allLi = document.querySelectorAll(".task");
  ev.preventDefault();
  deleteTag(allLi);
  if (sortImportantBtn.dataset.flag === "true") {
    sortImportantBtn.dataset.flag = "false";
    sortNum("min", "important");
  } else if (sortImportantBtn.dataset.flag === "false") {
    sortImportantBtn.dataset.flag = "true";
    sortNum("max", "important");
  }
});

//Сортировка по дате

sortBtnDate.setAttribute("data-flag", "true");
sortBtnDate.addEventListener("click", ev => {
  const allLi = document.querySelectorAll(".task");
  ev.preventDefault();
  deleteTag(allLi);
  if (sortBtnDate.dataset.flag === "true") {
    sortBtnDate.dataset.flag = "false";
    sortNum("min", "date");
  } else if (sortBtnDate.dataset.flag === "false") {
    sortBtnDate.dataset.flag = "true";
    sortNum("max", "date");
  }
});

function sortNum(value, key) {
  if (value === "min") {
    const sortMin = Object.values(objectTasks).sort((prev, next) => {
      return +next[key] - +prev[key];
    });
    renderTask(sortMin);
  } else if (value === "max") {
    const sortMax = Object.values(objectTasks).sort((prev, next) => {
      return +prev[key] - +next[key];
    });
    renderTask(sortMax);
  }
}

//Форма поиска
searchInput.oninput = function() {
  const val = this.value.trim();
  const allTask = document.querySelectorAll(".task");
  allTask.forEach(task => {
    if (task.textContent.search(val) === -1) {
      task.classList.add("task_hidden");
    } else {
      task.classList.remove("task_hidden");
    }
  });
};

//Получаем одну лишку
function getTask(task, objColor) {
  const btnEdit = task.querySelector(".task-edit");
  const editForm = task.querySelector(".edit-form");
  const editTextForm = task.querySelector(".edit-form__text");
  const btnEditForm = task.querySelector('.edit-true');
  const taskText = task.querySelector(".task-text");
  const btnCancel = task.querySelector(".edit-false");
  const formImportant = task.querySelector(".important-container_task");
  const valueInput = task.querySelector(".important-value");
  const btnImportant = task.querySelector('.task-important');
  const impNumUp = task.querySelector(".important-up");
  const impNumDown = task.querySelector(".important-down");
  const buttons = task.querySelector(".buttons");
  const id = task.dataset.id;

  // Событие на чекбоксе
  task.addEventListener("click", function(ev) {
      if (ev.target.classList.contains("task-check")) {
        if (ev.target.checked) {
          checkCompleted(true, id);
        } else {
          checkCompleted(false, id);
        }
      }
      checkButtonEvent(ev, task);
    });


  //Добавляю и удаляю completed при нажатии на checkbox
  function checkCompleted(flag, id) {
    objectTasks[id].completed = flag;
    pushChangeLocalStor(objectTasks)
  }


  //Добавляю и удаляю стили для неактивного таска, а также кнопку редактированья текста
  function checkButtonEvent(ev, task) {
    if (ev.target.checked) {
      task.classList.add("task_inactive");
      btnEdit.classList.add("task-edit_inactive");
      btnImportant.classList.add('task-important_inactive');
    } else if (
      ev.target.checked === false &&
      ev.target.className === "task-check"
    ) {
      btnEdit.classList.remove("task-edit_inactive");
      task.classList.remove("task_inactive");
      btnImportant.classList.remove('task-important_inactive');
    }
  }


  //Скрытие кнопок delete и edit
  task.addEventListener("click", ev=> {
    if (ev.target.className === "button-list") {
      buttons.classList.toggle("buttons_active");
    } else if (ev.target.className !== "button-list") {
      buttons.classList.remove("buttons_active");
    }
  });


  //События на кнопках редактированья событий
    btnEdit.addEventListener("click", ev => {
      editForm.classList.remove("edit-form_inactive");
      editTextForm.value = taskText.textContent;
      ev.preventDefault();
    });

    btnEditForm.addEventListener('click', ev =>{
      editForm.classList.remove("edit-form_inactive");
      if (!editTextForm.value) return modalAlert("Enter your text!!!");
      taskText.textContent = editTextForm.value;
      objectTasks[id].text = editTextForm.value;
      editForm.classList.add("edit-form_inactive");
      pushChangeLocalStor(objectTasks)
      ev.preventDefault();
    });

    btnCancel.addEventListener("click", ev => {
      editForm.classList.add("edit-form_inactive");
      ev.preventDefault();
    });


  //Удаление задания
task.addEventListener("click", function(ev) {
  if(ev.target.className === 'task-delete'){
    isConfirm(id, "Вы уверены?");
  }
});

  //Событие на кнопке важности
  task.addEventListener("click", ev => {
    if (ev.target.className === "task-important") {
      ev.preventDefault();
      formImportant.classList.toggle("important-container_active");
    } else if (ev.target.className === "btn-important_close") {
      ev.preventDefault();
      formImportant.classList.remove("important-container_active");
    }
  });


//Добавление важности при нажатии кнопки на таске
    valueInput.value = objectTasks[id].important;
    impNumUp.addEventListener("click", ev => {
      if (+valueInput.value < 5) valueInput.value++;
      changeColor(valueInput.value);
      objectTasks[id].important = valueInput.value;
      pushChangeLocalStor(objectTasks);
      ev.preventDefault();
    });

    impNumDown.addEventListener("click", ev => {
      if (+valueInput.value > 0) valueInput.value--;
      objectTasks[id].important = valueInput.value;
      pushChangeLocalStor(objectTasks);
      changeColor(valueInput.value);
      ev.preventDefault();
    });

  //Меняю цвет
  function changeColor(key) {
    task.classList.forEach(className => {
      if (className !== "task") {
        task.classList.remove(className);
      }
    });
    task.classList.add(objColor[key]);
  }
}

//Создаю checkbox
function createCheckbox() {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const span = document.createElement("span");
  span.classList.add("check-span");
  label.classList.add("task-checkbox");
  checkbox.setAttribute("type", "checkbox");
  checkbox.classList.add("task-check");
  label.appendChild(checkbox);
  label.appendChild(span);
  return label;
}

//Создаю блок с текстом и датой задачи
function createContentText(date, options, task) {
  const fragText = document.createDocumentFragment();
  const parseDate = date.toLocaleDateString("ru", options);
  const taskText = document.createElement("p");
  const taskDate = document.createElement("p");
  taskText.textContent = task.text;
  taskDate.textContent = parseDate;
  taskText.classList.add("task-text");
  taskDate.classList.add("task-date");
  fragText.appendChild(taskText);
  fragText.appendChild(taskDate);
  return fragText;
}

//Создаю блок для редактированья задачи
function createEditBlock() {
  const formEdit = document.createElement("form");
  const textArea = document.createElement("textarea");
  const editButtons = document.createElement("div");
  const formBtnEdit = document.createElement("button");
  const formBtnCancel = document.createElement("button");
  formEdit.setAttribute("action", "#");
  formEdit.classList.add("edit-form", "edit-form_inactive");
  textArea.setAttribute("maxlength", "150");
  textArea.classList.add("edit-form__text");
  editButtons.classList.add("edit-form__buttons");
  formBtnEdit.classList.add("btn-edit", "edit-true");
  formBtnEdit.textContent = "Edit";
  formBtnCancel.classList.add("btn-edit", "edit-false");
  formBtnCancel.textContent = "Cancel";
  formEdit.appendChild(textArea);
  editButtons.appendChild(formBtnCancel);
  editButtons.appendChild(formBtnEdit);
  formEdit.appendChild(editButtons);
  return formEdit;
}

function createImpotBlock() {
  const formImpot = document.createElement("form");
  const formWrapp = document.createElement("div");
  const textInput = document.createElement("input");
  const buttonsImpot = document.createElement("div");
  const btnUp = document.createElement("button");
  const btnDown = document.createElement("button");
  const closeBtn = document.createElement("button");
  formImpot.classList.add("important-container", "important-container_task");
  formImpot.setAttribute("action", "#");
  formWrapp.classList.add("importan-form__wrapp");
  textInput.classList.add("important-value");
  textInput.setAttribute("type", "text");
  textInput.setAttribute("value", "0");
  buttonsImpot.classList.add("buttons-important");
  btnUp.classList.add("important-up");
  btnUp.textContent = "+";
  btnDown.textContent = "-";
  btnDown.classList.add("important-down");
  closeBtn.classList.add("btn-important_close");

  buttonsImpot.appendChild(closeBtn);
  buttonsImpot.appendChild(btnUp);
  buttonsImpot.appendChild(btnDown);
  formImpot.appendChild(formWrapp);
  formImpot.appendChild(buttonsImpot);
  formWrapp.appendChild(textInput);

  return formImpot;
}

//Кнопка Меню для кнопок и кнопки удалить редактировать
function createButtonBlock() {
  const buttonList = document.createElement("div");
  const buttons = document.createElement("div");
  const btnEdit = document.createElement("button");
  const btnDelete = document.createElement("button");
  const btnImportant = document.createElement("button");

  buttonList.classList.add("button-list");
  buttons.classList.add("buttons");
  btnEdit.classList.add("task-edit");
  btnImportant.classList.add("task-important");
  btnDelete.classList.add("task-delete");

  buttons.appendChild(btnEdit);
  buttons.appendChild(btnImportant);
  buttons.appendChild(btnDelete);
  buttonList.appendChild(buttons);
  return buttonList;
}

//Создаю один таск
function createLi(task, objColor, label, buttonList) {
  const btnEdit = buttonList.querySelector(".task-edit");
  const checkbox = label.querySelector(".task-check");
  const li = document.createElement("li");
  const key = task.important;
  li.classList.add(objColor[key]);
  li.setAttribute("data-id", task.id);
  if (task.completed === true) {
    li.classList.add("task", "task_inactive");
    checkbox.checked = "true";
    btnEdit.classList.add("task-edit", "task-edit_inactive");
  } else {
    li.classList.add("task");
  }
  return li;
}

//Согбираю разметку в кучу
function createTask(task) {
  //Объект формата даты
  const date = new Date(task.date);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };

  //Объект классов для стилей по важности задач
  const objColor = {
    0: "task_zero",
    1: "task_one",
    2: "task_two",
    3: "task_three",
    4: "task_four",
    5: "task_fife"
  };

  const label = createCheckbox();
  const textContent = createContentText(date, options, task);
  const formEdit = createEditBlock();
  const buttonList = createButtonBlock();
  const li = createLi(task, objColor, label, buttonList);
  const formImportant = createImpotBlock();

  li.appendChild(label);
  li.appendChild(textContent);
  li.appendChild(formImportant);
  li.appendChild(formEdit);
  li.appendChild(buttonList);

  getTask(li, objColor);
  return li;
}

//Модалка по типу алерта
function modalAlert(value) {
  const text = document.querySelector(".alert-text");
  const modalWindow = document.querySelector(".modal-alert");
  const alertBtn = document.querySelector(".alert-button");
  modalWindow.classList.add("modal-alert_active");
  text.textContent = value || "default";
  const autoClose = window.setTimeout(() => {
    modalWindow.classList.remove("modal-alert_active");
  }, 3000);
  alertBtn.addEventListener("click", ev => {
    modalWindow.classList.remove("modal-alert_active");
    window.clearTimeout(autoClose);
  });
}

//Модалка по типу confirm

const modal = document.querySelector(".modal-wrapp");
const modalBtnConfirm = modal.querySelector(".confirm-btn_true");
const modalBtnCancel = modal.querySelector(".confirm-btn_false");
const allTask = document.querySelectorAll('.task');
let taskId = '';

function isConfirm(id, value) {
  taskId = id;
  const modalText = modal.querySelector(".modal-confirm__text");
  modal.classList.add("modal-wrapp_active");
  modalText.textContent = value || `Are you sure?`;
}


modalBtnCancel.addEventListener("click", ev => {
  modal.classList.remove("modal-wrapp_active");
});

modalBtnConfirm.addEventListener("click", function (ev) {
  const allTask = document.querySelectorAll('.task');
  modal.classList.remove("modal-wrapp_active");
  delete objectTasks[taskId];
  pushChangeLocalStor(objectTasks);
  allTask.forEach(task => {
    if (task.dataset.id === taskId) {
      task.remove();
    }
  })
})


