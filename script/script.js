const textForm = document.querySelector('.text-form')
const addTaskButton = document.querySelector('.add-task');
const ulList = document.querySelector('.task-list');
const searchInput = document.querySelector('.search-input');
const fragment = document.createDocumentFragment();

//Добавляю пустой объект
const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : {};
localStorage.setItem('tasks', JSON.stringify(tasks));
const localstrTasks = JSON.parse(localStorage.getItem('tasks'));

//Функция добавления задач 
function sortPush(localstrTasks) {
  Object.values(localstrTasks).forEach(task => {
    const li = createTask(task);
    fragment.appendChild(li);
    ulList.appendChild(fragment);
  })
}
sortPush(localstrTasks);

//Передаю значение с объекта 
function addTask(localstrTasks) {
  //Нажатие на кнопку addTask
  addTaskButton.addEventListener('click', (ev) => {
    evClickTaskData();
    ev.preventDefault();
  });
  //Нажатие на клавишу Enter
  const addForm = document.querySelector('.form');
  addForm.addEventListener('keydown', (ev) => {
    if (ev.keyCode !== 13) return;
    ev.preventDefault();
    evClickTaskData();
  })
}

function evClickTaskData() {
  const importantForm = document.querySelector('.important-container');
  const form = document.querySelector('.form');
  const formText = textForm.value;
  if (!formText) return modalAlert('Enter your text!!!');
  const task = addTaskData(formText, localstrTasks);
  pushChangeLocalStor(localstrTasks);
  const li = createTask(task);
  ulList.insertAdjacentElement('afterbegin', li);
  importantForm.reset();
  form.reset();
}

addTask(localstrTasks);

//Конструктор задачи
function addTaskData(formText, localstrTasks) {
  const impValue = document.querySelector('.important-value');
  const nowDate = Date.now();
  const newTask = {
    id: ` task-${Date.now() * 100}`,
    completed: false,
    text: formText,
    date: nowDate,
    important: impValue.value,
  };
  localstrTasks[newTask.id] = newTask;
  return newTask;
}

//Форма по важности
function importantForm() {
  const impValue = document.querySelector('.important-value');
  const impNumUp = document.querySelector('.important-up');
  const impNumDown = document.querySelector('.important-down');
  impNumUp.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (impValue.value < 5) impValue.value++;
  });
  impNumDown.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (impValue.value > 0) impValue.value--;
  })
}
importantForm();

function deleteTag(tags) {
  if (!tags) return;
  tags.forEach(tag => tag.remove())
}


//Сортировка текста
const btnSortText = document.querySelector('.sort-btn_text');
btnSortText.setAttribute('data-flag', 'true');

btnSortText.addEventListener('click', () => {
  const allLi = document.querySelectorAll('.task');
  deleteTag(allLi);
  if (btnSortText.dataset.flag === 'true') {
    btnSortText.dataset.flag = 'false';
    sortText('min');
  } else if (btnSortText.dataset.flag === 'false') {
    btnSortText.dataset.flag = 'true';
    sortText('max');
  }

})

function sortText(value) {
  if (value === 'min') {
    const sortMin = Object.values(localstrTasks).sort((prev, next) => {
      return prev.text < next.text ? 1 : prev.text > next.text ? -1 : 0;
    });
    sortPush(sortMin);
  } else if (value === 'max') {
    const sortMax = Object.values(localstrTasks).sort((prev, next) => {
      return prev.text > next.text ? 1 : prev.text < next.text ? -1 : 0;
    });
    sortPush(sortMax);
  }
}

//Сортировка по выполнености 
const btnSortCompl = document.querySelector('.sort-btn_completed');
btnSortCompl.setAttribute('data-flag', 'true');

btnSortCompl.addEventListener('click', () => {
  const allLi = document.querySelectorAll('.task');
  deleteTag(allLi);
  if (btnSortCompl.dataset.flag === 'true') {
    btnSortCompl.dataset.flag = 'false';
    sortNum('min', 'completed');
  } else if (btnSortCompl.dataset.flag === 'false') {
    btnSortCompl.dataset.flag = 'true';
    sortNum('max', 'completed');
  }
});


//Сортировка по важности
const sortImportantBtn = document.querySelector('.sort-btn_important');
sortImportantBtn.setAttribute('data-flag', 'true');

sortImportantBtn.addEventListener('click', (ev) => {
  const allLi = document.querySelectorAll('.task');
  ev.preventDefault();
  deleteTag(allLi);
  if (sortImportantBtn.dataset.flag === 'true') {
    sortImportantBtn.dataset.flag = 'false';
    sortNum('min', 'important');
  } else if (sortImportantBtn.dataset.flag === 'false') {
    sortImportantBtn.dataset.flag = 'true';
    sortNum('max', 'important');
  }
});

//Сортировка по дате
const sortBtnDate = document.querySelector('.sort-btn_date');
sortBtnDate.setAttribute('data-flag', 'true')
sortBtnDate.addEventListener('click', (ev) => {
  const allLi = document.querySelectorAll('.task');
  ev.preventDefault();
  deleteTag(allLi);
  if (sortBtnDate.dataset.flag === 'true') {
    sortBtnDate.dataset.flag = 'false';
    sortNum('min', 'date');
  } else if (sortBtnDate.dataset.flag === 'false') {
    sortBtnDate.dataset.flag = 'true';
    sortNum('max', 'date');
  }
});

function sortNum(value, key) {
  if (value === 'min') {
    const sortMin = Object.values(localstrTasks).sort((prev, next) => {
      return +next[key] - (+prev[key]);
    });
    sortPush(sortMin)
  } else if (value === 'max') {
    const sortMax = Object.values(localstrTasks).sort((prev, next) => {
      return +prev[key] - (+next[key]);
    });
    sortPush(sortMax);
  }
}

//Форма поиска
searchInput.oninput = function () {
  const val = this.value.trim();
  const allLi = document.querySelectorAll('.task');
  allLi.forEach(task => {
    if (task.textContent.search(val) === -1) {
      task.classList.add('task_hidden');
    } else {
      task.classList.remove('task_hidden');
    }
  })
}

//Получаем одну лишку
function getLi(li, objColor) {
  const btnEdit = li.querySelector('.task-edit');

  // Событие на чекбоксе
  function checkButton(editButton) {
    li.addEventListener('click', function (ev) {
      const id = li.dataset.id;
      if (ev.target.classList.contains('task-check')) {
        if (ev.target.checked) {
          checkCompleted(true, id);
        } else {
          checkCompleted(false, id);
        }
      }
      checkButtonEvent(ev, li, editButton);
    })
  }


  //Добавляю и удаляю completed при нажатии на checkbox
  function checkCompleted(flag, id) {
    localstrTasks[id].completed = flag;
    pushChangeLocalStor(localstrTasks)
  }
  //Добавляю и удаляю стили для неактивного таска, а также кнопку редактированья текста
  function checkButtonEvent(ev, task, editButton) {
    if (ev.target.checked) {
      task.classList.add('task_inactive');
      editButton.classList.add('task-edit_inactive');
    } else if (ev.target.checked === false && ev.target.className === 'task-check') {
      editButton.classList.remove('task-edit_inactive');
      task.classList.remove('task_inactive');
    }
  }
  checkButton(btnEdit, localstrTasks);


  //Скрытие кнопок delete и edit
  li.addEventListener('click', function (ev) {
    const buttons = li.querySelector('.buttons');
    if (ev.target.className === 'button-list') {
      buttons.classList.toggle('buttons_active');
    } else if (ev.target.className !== 'button-list') {
      buttons.classList.remove('buttons_active');
    }
  })

  //Удаление задания 
  li.addEventListener('click', function (ev) {
    if (ev.target.classList.contains('task-delete')) {
      const id = li.dataset.id;
      isConfirm(id,li, 'Вы уверены?');
    }
  })


  //Редактированье задачи
  li.addEventListener('click', (ev) => {
    const editForm = li.querySelector('.edit-form');
    const editTextForm = li.querySelector('.edit-form__text');
    const taskText = li.querySelector('.task-text');

    if (ev.target.className === 'task-edit') {
      editForm.classList.remove('edit-form_inactive');
      editTextForm.value = taskText.textContent;
      replaceText(editTextForm, taskText, li, editForm);
    }
  });


  //События на кнопках редактированья событий
  function replaceText(editTextForm, taskText, li, editForm) {
    const btnEdit = li.querySelector('.edit-true');
    const btnCancel = li.querySelector('.edit-false');

    btnEdit.addEventListener('click', (ev) => {
      const id = li.dataset.id;
      if(!editTextForm.value) return modalAlert('Enter your text!!!');
      ev.preventDefault();
      taskText.textContent = editTextForm.value;
      localstrTasks[id].text = editTextForm.value;
      editForm.classList.add('edit-form_inactive');
      pushChangeLocalStor(localstrTasks);
      
    })
    btnCancel.addEventListener('click', (ev) => {
      editForm.classList.add('edit-form_inactive');
      ev.preventDefault();
    })
  }


  //Событие на кнопке важности
  li.addEventListener('click', (ev) => {
    const id = li.dataset.id;
    const formImportant = li.querySelector('.important-container_task');
    if (ev.target.className === 'task-important' ) {
      ev.preventDefault();
      formImportant.classList.toggle('important-container_active');
      importVlue(id, ev);
    }else  if(ev.target.className === 'btn-important_close'){
      ev.preventDefault();
      formImportant.classList.remove('important-container_active');
    }
  });



  function importVlue(id) {
    const valueInput = li.querySelector('.important-value')
    const impNumUp = li.querySelector('.important-up');
    const impNumDown = li.querySelector('.important-down');
    valueInput.value = localstrTasks[id].important;
      impNumUp.addEventListener('click', (ev) => {
        if (+valueInput.value < 5) valueInput.value++;
        changeColor(valueInput.value);
        localstrTasks[id].important = valueInput.value;
        pushChangeLocalStor(localstrTasks);
        ev.preventDefault();
      });
    impNumDown.addEventListener('click', (ev) => {
      if (+valueInput.value > 0) valueInput.value--;
      localstrTasks[id].important = valueInput.value;
      pushChangeLocalStor(localstrTasks);
      changeColor(valueInput.value)
      ev.preventDefault();
    })
  }




//Меняю цвет
  function changeColor( key) {
      li.classList.forEach(className =>{
        if(className !== 'task'){
          li.classList.remove(className)
        }
      });
       li.classList.add(objColor[key]);
  }
}


function pushChangeLocalStor(localstrTasks){
  const taskObj = JSON.stringify(localstrTasks);
  localStorage.setItem('tasks', taskObj);
}

//Создаю checkbox
function createCheckbox() {
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  const span = document.createElement('span');
  span.classList.add('check-span')
  label.classList.add('task-checkbox');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('task-check');
  label.appendChild(checkbox);
  label.appendChild(span);
  return label;
}

//Создаю блок с текстом и датой задачи
function createContentText(date, options, task) {
  const fragText = document.createDocumentFragment();
  const parseDate = date.toLocaleDateString('ru', options);
  const taskText = document.createElement('p');
  const taskDate = document.createElement('p');
  taskText.textContent = task.text;
  taskDate.textContent = parseDate;
  taskText.classList.add('task-text');
  taskDate.classList.add('task-date');
  fragText.appendChild(taskText);
  fragText.appendChild(taskDate);
  return fragText
}

//Создаю блок для редактированья задачи
function createEditBlock() {
  const formEdit = document.createElement('form');
  const textArea = document.createElement('textarea');
  const editButtons = document.createElement('div');
  const formBtnEdit = document.createElement('button');
  const formBtnCancel = document.createElement('button');
  formEdit.setAttribute('action', '#');
  formEdit.classList.add('edit-form', 'edit-form_inactive');
  textArea.setAttribute('maxlength', '150');
  textArea.classList.add('edit-form__text');
  editButtons.classList.add('edit-form__buttons');
  formBtnEdit.classList.add('btn-edit', 'edit-true');
  formBtnEdit.textContent = 'Edit';
  formBtnCancel.classList.add('btn-edit', 'edit-false');
  formBtnCancel.textContent = 'Cancel';
  formEdit.appendChild(textArea);
  editButtons.appendChild(formBtnCancel);
  editButtons.appendChild(formBtnEdit);
  formEdit.appendChild(editButtons);
  return formEdit;
}

function createImpotBlock(){
  const formImpot = document.createElement('form');
  const formWrapp = document.createElement('div');
  const textInput = document.createElement('input');
  const buttonsImpot = document.createElement('div');
  const btnUp = document.createElement('button');
  const btnDown = document.createElement('button');
  const closeBtn = document.createElement('button');
  formImpot.classList.add('important-container', 'important-container_task');
  formImpot.setAttribute('action','#');
  formWrapp.classList.add('importan-form__wrapp');
  textInput.classList.add('important-value');
  textInput.setAttribute('type', 'text');
  textInput.setAttribute('value', '0');
  buttonsImpot.classList.add('buttons-important');
  btnUp.classList.add('important-up');
  btnUp.textContent = '+';
  btnDown.textContent = '-';
  btnDown.classList.add('important-down');
  closeBtn.classList.add('btn-important_close');

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
  const buttonList = document.createElement('div');
  const buttons = document.createElement('div');
  const btnEdit = document.createElement('button');
  const btnDelete = document.createElement('button');
  const btnImportant = document.createElement('button');

  buttonList.classList.add('button-list');
  buttons.classList.add('buttons');
  btnEdit.classList.add('task-edit');
  btnImportant.classList.add('task-important')
  btnDelete.classList.add('task-delete');
  
  buttons.appendChild(btnEdit);
  buttons.appendChild(btnImportant);
  buttons.appendChild(btnDelete);
  buttonList.appendChild(buttons);
  return buttonList;
}


//Создаю один таск 
function createLi(task, objColor, label, buttonList) {
  const btnEdit = buttonList.querySelector('.task-edit');
  const checkbox = label.querySelector('.task-check');
  const li = document.createElement('li');
  const key = task.important
  li.classList.add(objColor[key]);
  li.setAttribute('data-id', task.id);
  if (task.completed === true) {
    li.classList.add('task', 'task_inactive');
    checkbox.checked = 'true'
    btnEdit.classList.add('task-edit', 'task-edit_inactive');
  } else {
    li.classList.add('task');
  }
  return li;
}

//Согбираю разметку в кучу
function createTask(task) {
  //Объект формата даты
  const date = new Date(task.date);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  //Объект классов для стилей по важности задач
  const objColor = {
    0: 'task_zero',
    1: 'task_one',
    2: 'task_two',
    3: 'task_three',
    4: 'task_four',
    5: 'task_fife',
  };

  const label = createCheckbox();
  const textContent = createContentText(date, options, task);
  const formEdit = createEditBlock();
  const buttonList = createButtonBlock();
  const li = createLi(task, objColor, label, buttonList);
  const formImportant = createImpotBlock();


  li.appendChild(label);
  li.appendChild(textContent);
  li.appendChild(formImportant)
  li.appendChild(formEdit);
  li.appendChild(buttonList);

  getLi(li, objColor);
  return li;
}


//Модалка по типу алерта 
function modalAlert(value) {
  const text = document.querySelector('.alert-text');
  const modalWindow = document.querySelector('.modal-alert');
  const alertBtn = document.querySelector('.alert-button');
  modalWindow.classList.add('modal-alert_active');
  text.textContent = value || 'default';
  const autoClose = window.setTimeout(() => {
    modalWindow.classList.remove('modal-alert_active');
  }, 3000)
  alertBtn.addEventListener('click', (ev) => {
    modalWindow.classList.remove('modal-alert_active');
    window.clearTimeout(autoClose);
  });
}


//Модалка по типу confirm
function isConfirm(id,li, value) {
  const modal = document.querySelector('.modal-wrapp');
  const modalBtnCancel = modal.querySelector('.confirm-btn_false');
  const modalBtnConfirm = modal.querySelector('.confirm-btn_true');
  const modalText = modal.querySelector('.modal-confirm__text');
  modal.classList.add('modal-wrapp_active');
  modalText.textContent = value || `Are you sure?`;
    modalBtnCancel.addEventListener('click', (ev)=>{
      ev.preventDefault();
      modal.classList.remove('modal-wrapp_active');
    });

    modalBtnConfirm.addEventListener('click', (ev)=>{
      ev.preventDefault();
      modal.classList.remove('modal-wrapp_active');
      delete localstrTasks[id];
      pushChangeLocalStor(localstrTasks);
      li.remove()
    });
}
