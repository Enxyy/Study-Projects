// Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.

function createNumbersArray(count) {
  const arr = [];
  for (let i = 1; i <= count; i++) {
    arr.push(i,i);
  }
  return arr;
}

// // Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел

function shuffle(arr) {
  for (let i = arr.length - 1; i>0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// // Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.

function startGame(container, count) {
  const initialArr = createNumbersArray(count);
  const shuffledArr = shuffle(initialArr);
  let clickCount = 0;
  let temp1 = 0;
  let temp2 = 0;
  let tempId1 = 0;
  let tempId2 = 0;
  for (let i = 0; i<shuffledArr.length; i++) {
    let card = document.createElement('div');
    card.classList.add('col-3', 'mb-3');
    let cardContent = document.createElement('div');
    cardContent.classList.add('game__card');
    cardContent.id = i+1;
    cardContent.textContent = shuffledArr[i];
    cardContent.addEventListener('click', function() {
      clickCount+=1;
      cardContent.classList.toggle('card-flipped');
      if (clickCount == 1) {
        temp1 = cardContent.textContent;
        tempId1 = cardContent.id;
      };
      if (clickCount == 2) {
        temp2 = cardContent.textContent;
        tempId2 = cardContent.id;
      };
      if (clickCount == 3) {
        if (temp1 != temp2) {
          document.getElementById(tempId1).classList.toggle('card-flipped');
          document.getElementById(tempId2).classList.toggle('card-flipped');
        };
        clickCount = 1;
        temp1 =cardContent.textContent;
        tempId1 = cardContent.id;
        temp2 = 0;
        tempId2 = 0;
      }
    });
    card.append(cardContent);
    container.append(card);
  }
}


