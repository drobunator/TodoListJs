const tasksArr = [
  {
    id: " task-11.628603159345264",
    completed: false,
    text: "Товарищи! реализация намеченных плановых заданий 1",
    date: 1579714500992,
    important: "2"
  },
  {
    id: " task-58.569179460735164",
    completed: false,
    text: "С другой стороны реализация намеченных плановых 2",
    date: 1579714536679,
    important: "0"
  },
  {
    id: " task-10.23516143195411",
    completed: false,
    text: "С этой стороны начало повседневной работы 3",
    date: 1579714573260,
    important: "5"
  },
  {
    id: " task-16.30574047489135",
    completed: false,
    text: " Значимость этих проблем настолько очевидна 4 Значимость этих проблем настолько очевидна 4 Значимость этих проблем настолько очевидна 4 Значимость этих проблем настолько очевидна 4",
    date: 1579714615235,
    important: "1"
  },
  {
    id: " task-85.86146720984149",
    completed: false,
    text: "Значимость этих действий настолько очевидна 5",
    date: 1579714677382,
    important: "4"
  },
];



const textForm = document.querySelector('.text-form')
const addTaskButton = document.querySelector('.add-task');
const ulList = document.querySelector('.task-list');


//Создаю объек объектов
const tasksObj = tasksArr.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

//Сортировка  по выполненым
const fragment = document.createDocumentFragment();
function sortTask(tasksObj) {
  const sortTasks = Object.values(tasksObj).sort((prev, next) => {
    return (+prev.completed) - +next.completed;
  });
  return sortTasks;
}

const sortTasks = sortTask(tasksObj);
//Функция добавления задач 
function sortPush(sortTasks) {
  Object.values(sortTasks).forEach(task => {
    const li = createList(task);
    fragment.appendChild(li);
    ulList.appendChild(fragment);
  })
}

sortPush(sortTasks);



//Передаю значение с объекта 
function addTask(tasksObj) {
  addTaskButton.addEventListener('click', () => {
    const importantForm = document.querySelector('.important-container');
    const form = document.querySelector('.form');
    const formText = textForm.value;
    if (!formText) return console.log('Передайте значение!!!');
    const task = addTaskData(formText, tasksObj)
    const li = createList(task);
    ulList.insertAdjacentElement('afterbegin', li);
    importantForm.reset();
    form.reset();
  });
}

addTask(tasksObj)


function addTaskData(formText, tasksObj) {
  const impValue = document.querySelector('.important-value');
  const nowDate = dateNow();
  const newTask = {
    id: ` task-${Math.random() * 100}`,
    completed: false,
    text: formText,
    date: nowDate,
    important: impValue.value,
  };
  tasksObj[newTask.id] = newTask;
  return newTask;
}


function dateNow (){
  const date = Date.now(); 
  return date;
}


function newDate() {
  let date = new Date();
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  return date.toLocaleDateString('ru', options);
}


function importantForm(){
  
  const impValue = document.querySelector('.important-value');
  const impNumUp = document.querySelector('.important-up');
  const impNumDown = document.querySelector('.important-down');
  impNumUp.addEventListener('click', (ev)=>{
    ev.preventDefault();
    if(impValue.value < 5){
      impValue.value++;
    }
  });
  impNumDown.addEventListener('click', (ev)=>{
    ev.preventDefault();
    if(impValue.value > 0){
      impValue.value--;
    }
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


btnSortText.addEventListener('click', ()=>{
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
    const sortMin = Object.values(tasksObj).sort((prev, next) => {
     return prev.text < next.text ? 1 : prev.text > next.text ? -1 : 0;
    });
    sortPush(sortMin);
  } else if (value === 'max') {
    const sortMax = Object.values(tasksObj).sort((prev, next) => {
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
    sortNum('max', 'completed');
  } else if (btnSortCompl.dataset.flag === 'false') {
    btnSortCompl.dataset.flag = 'true';
    sortNum('min', 'completed');
  }
});



//Сортировка по важности
const sortImportantBtn = document.querySelector('.sort-btn_important');
sortImportantBtn.setAttribute('data-flag', 'true');

sortImportantBtn.addEventListener('click', (ev)=>{
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
})



function sortNum(value, key) {
  if (value === 'min') {
    const sortMin = Object.values(tasksObj).sort((prev, next) => {
      return +next[key] - (+prev[key]);
    });
    sortPush(sortMin)
  } else if (value === 'max') {
    const sortMax = Object.values(tasksObj).sort((prev, next) => {
      return +prev[key] - (+next[key]);
    });
    sortPush(sortMax);
  }
}




//Получаем одну лишку
function getLi(li) {

  const btnEdit = li.querySelector('.task-edit');
  const btnDelete = li.querySelector('.task-delete');
  const date = li.querySelector('.task-date');
  const taskText = li.querySelector('.task-text');
  const buttonList = li.querySelector('.button-list');
  const taskCheck = li.querySelector('.task-check');
  const ulList = document.querySelector('.task-list');
  const searchInput = document.querySelector('.search-input');



  //Форма поиска
  searchInput.oninput = function () {
    const val = this.value.trim()
    const allLi = document.querySelectorAll('.task');
    allLi.forEach(task => {
      if (task.textContent.search(val) === -1) {
        task.classList.add('task_hidden');
      } else {
        task.classList.remove('task_hidden');
      }
    })
  }



  // Событие на чекбоксе
  function checkButton(editButton) {
    li.addEventListener('click', function (ev) {
      if (ev.target.classList.contains('task-check')) {
        const parent = ev.target.closest('[data-id]')
        const id = parent.dataset.id;
        if (ev.target.checked) {
          tasksObj[id].completed = true;
          checkedSort(true, tasksObj);
        } else {
          tasksObj[id].completed = false;
          checkedSort(false, tasksObj);
        }
      }
      checkButtonEvent(ev, li, editButton);
    })
  }


  function checkButtonEvent(ev, task, editButton) {

    if (ev.target.checked) {
      task.classList.add('task_inactive');
      editButton.classList.add('task-edit_inactive');
    } else if (ev.target.checked === false && ev.target.className === 'task-check') {
      editButton.classList.remove('task-edit_inactive');
      task.classList.remove('task_inactive');
    }
  }



  //Сортировка по нажатию на checkbox
  function checkedSort(status, tasksObj) {
    const allLi = document.querySelectorAll('.task');
    const sortTask = Object.values(tasksObj).sort((prev, next) => {
      return prev.completed - next.completed;
    })
    deleteTag(allLi);
    sortPush(sortTask);
  }
  checkButton(btnEdit, tasksObj);




  //Скрытие кнопок delete и edit
  li.addEventListener('click', function (ev) {
    const buttons = li.querySelector('.buttons');
    if(ev.target.className === 'button-list'){
    buttons.classList.toggle('buttons_active');
    }else if(ev.target.className !== 'button-list'){
      buttons.classList.remove('buttons_active');
    }
    ;
  })




  //Удаление задания 
  li.addEventListener('click', function (ev) {
    if (ev.target.classList.contains('task-delete')) {
      const parent = ev.target.closest('[data-id]')
      const id = parent.dataset.id;
      const isConfirm = confirm('Точно вы хотите удалить задачу!');
      if (!isConfirm) return;
      delete tasksObj[id];
      parent.remove()
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
      btnEdit.addEventListener('click',(ev)=>{
        const id = li.getAttribute('data-id');
        taskText.textContent = editTextForm.value;
        tasksObj[id].text = editTextForm.value;
        editForm.classList.add('edit-form_inactive');
        ev.preventDefault();
      })
      btnCancel.addEventListener('click', (ev)=>{
        editForm.classList.add('edit-form_inactive');
        ev.preventDefault();
      })
      }
}


function createList(task) {

  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  const span = document.createElement('span');
  span.classList.add('check-span')
  label.classList.add('task-checkbox');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('task-check');
  label.appendChild(checkbox);
  label.appendChild(span);

  const taskText = document.createElement('p');
  const taskDate = document.createElement('p');
  taskText.textContent = task.text;
  taskDate.textContent = newDate(task.date);
  taskText.classList.add('task-text');
  taskDate.classList.add('task-date');


  const formEdit = document.createElement('form');
  const textArea = document.createElement('textarea');
  const editButtons = document.createElement('div');
  const formBtnEdit = document.createElement('button');
  const formBtnCancel = document.createElement('button');
  formEdit.setAttribute('action', '#');
  formEdit.classList.add('edit-form', 'edit-form_inactive');
  textArea.setAttribute('maxlength', '50');
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


  const buttonList = document.createElement('div');
  const buttons = document.createElement('div');
  const btnEdit = document.createElement('button');
  const btnDelete = document.createElement('button');
  buttonList.classList.add('button-list');
  buttons.classList.add('buttons');
  btnEdit.classList.add('task-edit');
  btnDelete.classList.add('task-delete');
  buttons.appendChild(btnEdit);
  buttons.appendChild(btnDelete);
  buttonList.appendChild(buttons);

  const objColor = {
    0: 'task_zero',
    1: 'task_one',
    2: 'task_two',
    3: 'task_three',
    4: 'task_four',
    5: 'task_fife',
  }

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




  li.appendChild(label);
  li.appendChild(taskText);
  li.appendChild(taskDate);
  li.appendChild(formEdit);
  li.appendChild(buttonList);


  getLi(li);
  return li;

}
