document.addEventListener('DOMContentLoaded', async () => {
  // Этап 3. Создайте функцию вывода одного студента в таблицу, по аналогии с тем, как вы делали вывод одного дела в модуле 8. Функция должна вернуть html элемент с информацией и пользователе.У функции должен быть один аргумент - объект студента.
function getStudentItem(studentObj) {
  let studentItem = document.createElement('tr');
  studentItem.setAttribute('id', 'tr');
  let studentFullName = document.createElement('td');
  let studentBirthday = document.createElement('td');
  let studentStartYear = document.createElement('td');
  let studentFaculty = document.createElement('td');
  let deleteButton = document.createElement('button');

  studentFullName.textContent = studentObj.surname + ' ' + studentObj.name + ' ' + studentObj.lastname;
  let studentDob = new Date(studentObj.birthday);
  let now = new Date();
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let dob = new Date(studentDob.getFullYear(), studentDob.getMonth(), studentDob.getDate());
  let dobnow = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  let age;
  age = today.getFullYear() - dob.getFullYear();
  if (today < dobnow) {
    age = age-1;
  }
  studentBirthday.textContent = studentDob.getDate() + ' ' + (studentDob.getMonth() + 1) + ' ' + studentDob.getFullYear() + '(' + age + ' лет)';
  let studentsClass;
  studentsClass = today.getFullYear() - studentObj.studyStart;
  if (today.getMonth() < 8) {
    studentsClass -= 1;
  };
  studentsClassText = studentsClass + ' курс';
  if ((today.getFullYear() >= (Number(studentObj.studyStart) + 4)) && (today.getMonth() >= 8)) {
    studentsClassText = 'закончил';
  };

  studentStartYear.textContent = studentObj.studyStart + ' - ' + (Number(studentObj.studyStart) + 4) + '(' + studentsClassText + ')';
  studentFaculty.textContent = studentObj.faculty;

  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';
  deleteButton.addEventListener('click', () => {
    if (confirm('Вы уверены?')) {
      studentItem.remove();
      fetch(`http://localhost:3000/api/students/${studentObj.id}`, {
        method: 'DELETE',
      });
  };
  });
  studentItem.append(studentFullName);
  studentItem.append(studentFaculty);
  studentItem.append(studentBirthday);
  studentItem.append(studentStartYear);
  studentItem.append(deleteButton);

  return {
    studentItem,
  };
}


// Этап 4. Создайте функцию отрисовки всех студентов. Аргументом функции будет массив студентов.Функция должна использовать ранее созданную функцию создания одной записи для студента.Цикл поможет вам создать список студентов.Каждый раз при изменении списка студента вы будете вызывать эту функцию для отрисовки таблицы.
async function getStudentsList() {
  const response = await fetch('http://localhost:3000/api/students');
  const studentsList = await response.json();
  return studentsList;
};

let serverCopy = await getStudentsList();
for (student of serverCopy) {
  student.fio = student.surname + ' ' + student.name + ' ' + student.lastname;
  student.finalYear = Number(student.studyStart) + 4;
};
console.log(serverCopy);

async function renderStudentsTable(studentsList) {
  document.getElementById('studentsList').innerHTML = '';
  for (let i = 0; i<studentsList.length; i++) {
    let studentsItem = getStudentItem(studentsList[i]).studentItem;
    document.getElementById('studentsList').append(studentsItem);
  };
}
renderStudentsTable(serverCopy);

// Этап 5. К форме добавления студента добавьте слушатель события отправки формы, в котором будет проверка введенных данных.Если проверка пройдет успешно, добавляйте объект с данными студентов в массив студентов и запустите функцию отрисовки таблицы студентов, созданную на этапе 4.
document.getElementById('newStudentForm').addEventListener('submit', function(event) {
  event.preventDefault();
});

var now = new Date();
if (String(now.getDate()).length == 1) {
  todayDate = '0' + now.getDate();
} else {
  todayDate = now.getDate();
  };
if (String(now.getMonth()).length == 1) {
  todayMonth = ('0' + now.getMonth()) + 1;
}else {
  todayMonth = now.getMonth() + 1;
  };
var today = now.getFullYear() + '-' + todayMonth + '-' + todayDate;

document.getElementById('birthDate').setAttribute('min', '1900-01-01');
document.getElementById('birthDate').setAttribute('max', today);

document.getElementById('startYear').setAttribute('min', '2000');
document.getElementById('startYear').setAttribute('max', now.getFullYear());

document.getElementById('addStudent').addEventListener('click', async function() {
  if (document.getElementById('studentName').value !== ''
    && document.getElementById('studentSurname').value !== ''
    && document.getElementById('studentMiddlename').value !== ''
    && document.getElementById('birthDate').value !== null
    && (document.getElementById('startYear').value >= 2000 && document.getElementById('startYear').value <= now.getFullYear())
    && document.getElementById('faculty').value !== '') {
      const response = await fetch ('http://localhost:3000/api/students', {
        method: 'POST',
        body: JSON.stringify({
          name: document.getElementById('studentName').value,
          surname: document.getElementById('studentSurname').value,
          lastname: document.getElementById('studentMiddlename').value,
          birthday: document.getElementById('birthDate').valueAsDate,
          studyStart: document.getElementById('startYear').value,
          faculty: document.getElementById('faculty').value,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      document.getElementById('studentsList').innerHTML = '';
      document.getElementById('studentName').value = '';
      document.getElementById('studentSurname').value = '';
      document.getElementById('studentMiddlename').value = '';
      document.getElementById('birthDate').value = '';
      document.getElementById('startYear').value = '';
      document.getElementById('faculty').value = '';
      serverCopy = await getStudentsList();
      renderStudentsTable(serverCopy);
    };
  });

// Этап 5. Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.
const sortStudents = (arr, prop, dir = false) => arr.sort((a,b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 0);
sortStatus = false;

document.getElementById('studentNameHeader').addEventListener('click', function() {
  sortStudents(serverCopy, 'surname', sortStatus);
  sortStatus = !sortStatus;
  document.getElementById('studentsList').innerHTML = '';
  renderStudentsTable(serverCopy);
});

document.getElementById('studentFacultyHeader').addEventListener('click', function() {
  sortStudents(serverCopy, 'faculty', sortStatus);
  sortStatus = !sortStatus;
  document.getElementById('studentsList').innerHTML = '';
  renderStudentsTable(serverCopy);
});

document.getElementById('studentAgeHeader').addEventListener('click', function() {
  sortStudents(serverCopy, 'birthday', sortStatus);
  sortStatus = !sortStatus;
  document.getElementById('studentsList').innerHTML = '';
  renderStudentsTable(serverCopy);
});

document.getElementById('studentPeriodHeader').addEventListener('click', function() {
  sortStudents(serverCopy, 'studyStart', sortStatus);
  sortStatus = !sortStatus;
  document.getElementById('studentsList').innerHTML = '';
  renderStudentsTable(serverCopy);
});

// Этап 6. Создайте функцию фильтрации массива студентов и добавьте события для элементов формы.
function filter(arr, prop, value) {
  let result = [],
      copy = [...arr];
  for (const item of copy) {
    if (String(item[prop]).includes(value) == true) result.push(item);
  }
  return result
};

document.getElementById('filterName').addEventListener('keyup', function() {
  const filterFio = document.getElementById('filterName').value;
  let newArr = [...serverCopy];
  if (filterFio !== '') {
    newArr = filter(newArr, 'fio', filterFio);
  };
  document.getElementById('studentsList').innerHTML = '';
  document.getElementById('filterFaculty').value = '';
  document.getElementById('filterStartYear').value = '';
  document.getElementById('filterFinalYear').value = '';
  renderStudentsTable(newArr);
});

document.getElementById('filterFaculty').addEventListener('keyup', function() {
  const filterFaculty = document.getElementById('filterFaculty').value;
  let newArr = [...serverCopy];
  if (filterFaculty !== '') {
    newArr = filter(newArr, 'faculty', filterFaculty);
  };
  document.getElementById('studentsList').innerHTML = '';
  document.getElementById('filterName').value = '';
  document.getElementById('filterStartYear').value = '';
  document.getElementById('filterFinalYear').value = '';
  renderStudentsTable(newArr);
});

document.getElementById('filterStartYear').addEventListener('keyup', function() {
  const filterStartYear = document.getElementById('filterStartYear').value;
  let newArr = [...serverCopy];
  if (filterStartYear !== '') {
    newArr = filter(newArr, 'studyStart', filterStartYear);
  };
  document.getElementById('studentsList').innerHTML = '';
  document.getElementById('filterFaculty').value = '';
  document.getElementById('filterName').value = '';
  document.getElementById('filterFinalYear').value = '';
  renderStudentsTable(newArr);
});

document.getElementById('filterFinalYear').addEventListener('keyup', function() {
  const filterFinalYear = Number(document.getElementById('filterFinalYear').value);
  let newArr = [...serverCopy];
  if (filterFinalYear !== '') {
    newArr = filter(newArr, 'finalYear', filterFinalYear);
  };
  document.getElementById('studentsList').innerHTML = '';
  document.getElementById('filterFaculty').value = '';
  document.getElementById('filterStartYear').value = '';
  document.getElementById('filterName').value = '';
  renderStudentsTable(newArr);
});
})
