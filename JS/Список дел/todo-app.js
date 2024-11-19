(function() {
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;
    input.oninput = function() {
      if (!input.value) {
        button.disabled = true;
      } else {
        button.disabled = false;
      }
    }

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(object) {
    let item = document.createElement('li');

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    if (object.done === true) {
      item.classList.add('list-group-item-success')
    }
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = object.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp(container, title = 'Список дел', listname) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    userName = dataToJson(listname);
    data = localStorage.getItem(userName);
    if (data === null) {
      data = dataToJson([]);
      localStorage.setItem('todoData', data);
    }

    localStorage.setItem('todoData', data);

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    data = jsonToData(localStorage.getItem('todoData'));
    for (let i = 0; i<data.length; i++) {
      let oldItem = createTodoItem(data[i]);
      oldItem.doneButton.addEventListener('click', function() {
        oldItem.item.classList.toggle('list-group-item-success');
        statusToggle(data[i].id);
        localStorageWrite(listname, getTodoData());
      });

      oldItem.deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены?')) {
          removeFromTodoList(data[i].id);
          localStorageWrite(listname, getTodoData());
          oldItem.item.remove();
        }
      });
      todoList.append(oldItem.item);
    }

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      counterIncr();

      let todoItemObject = {
        id : getCounterData(),
        name : todoItemForm.input.value,
        done : false,
      }

      let todoItem = createTodoItem(todoItemObject);

      addToTodoList({id:todoItemObject.id, name: todoItemObject.name, done: todoItemObject.done});
      localStorageWrite(listname, getTodoData());

      todoItem.doneButton.addEventListener('click', function() {
        todoItem.item.classList.toggle('list-group-item-success');
        statusToggle(todoItemObject.id);
        localStorageWrite(listname, getTodoData());
      });

      todoItem.deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены?')) {
          removeFromTodoList(todoItemObject.id);
          localStorageWrite(listname, getTodoData());
          todoItem.item.remove();
        }
      });

      todoList.append(todoItem.item);

      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  };

  function dataToJson(data) {
    return JSON.stringify(data);
  }

  function jsonToData(data) {
    return JSON.parse(data);
  }

  function getTodoData() {
    return localStorage.getItem('todoData');
  }

  function setTodoData(data) {
    localStorage.setItem('todoData', data);
  }

  function getCounterData() {
    return localStorage.getItem('counterData');
  }

  function setCounterData(data) {
    localStorage.setItem('counterData', data)
  }

  function counterIncr() {
    let counterData = getCounterData();
    if (counterData===null) {
      counterData=0;
    }
    counterData++;
    setCounterData(dataToJson(counterData));
  }

  function statusToggle(id) {
    let todoList = jsonToData(getTodoData());
    for (let i=0; i< todoList.length; i++) {
      if (todoList[i].id === id) {
        todoList[i].done = !todoList[i].done;
      }
    }
    setTodoData(dataToJson(todoList));
  }

  function addToTodoList(TodoItem) {
    let todoList = getTodoData();
    todoList = todoList ? jsonToData(todoList) : [];
    todoList.push(TodoItem);
    setTodoData(dataToJson(todoList));
  }

  function removeFromTodoList(id) {
    let todoList = jsonToData(getTodoData());
    let newTodoList = [];
    for (let i=0; i< todoList.length; i++) {
      if (todoList[i].id !== id) {
        newTodoList.push(todoList[i])
      }
    }
    setTodoData(dataToJson(newTodoList));
  }

  function localStorageWrite(user, data) {
    userData = data;
    userName = dataToJson(user);
    localStorage.setItem(userName, userData);
  }

  function localStorageRead(user) {
    return jsonToData(localStorage.getItem(user));
  }

  window.createTodoApp = createTodoApp;
})();
