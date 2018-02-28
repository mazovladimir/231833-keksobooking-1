'use strict';

(function () {
  var roomType = document.querySelector('#type');
  var roomNumber = document.querySelector('#room_number');
  var roomCapacity = document.querySelector('#capacity');
  var roomPrice = document.querySelector('#price');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var form = document.querySelector('.notice__form');
  var formReset = form.querySelector('.form__reset');

  var CAPACITY_MAP = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  selectRoomCapacity();

  window.synchronizeFields(timeIn, timeOut, ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], syncValues);

  window.synchronizeFields(timeOut, timeIn, ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], syncValues);

  window.synchronizeFields(roomType, roomPrice, ['bungalo', 'flat', 'house', 'palace'], [0, 1000, 5000, 10000], syncValueWithMin);

  roomNumber.addEventListener('change', function () {
    selectRoomCapacity();
  });

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.post('', new FormData(form), onLoad, onError);
  });

  formReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.map.resetForm();
  });

  function onLoad() {
    divElement('Данные успешно отправлены');
    window.map.resetForm();
  }

  function onError(error) {
    divElement(error);
    window.map.resetForm();
  }

  function divElement(message) {
    var node = document.createElement('div');
    node.className = 'message';
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);
    setTimeout(function () {
      document.querySelector('.message').remove();
    }, 3000);
  }

  function syncValues(element, value) {
    element.value = value;
  }

  function syncValueWithMin(element, value) {
    element.min = value;
    element.placeholder = value;
  }

  function selectRoomCapacity() {
    var numberSelected = roomNumber.options[roomNumber.selectedIndex];
    if (numberSelected.selected) {
      disableRoomCapacity(CAPACITY_MAP[numberSelected.value]);
    }
  }

  function disableRoomCapacity(values) {
    for (var i = 0; i < roomCapacity.options.length; i++) {
      var optionCapacity = roomCapacity.options[i];
      if (values.indexOf(optionCapacity.value) === -1) {
        optionCapacity.disabled = true;
      } else {
        optionCapacity.disabled = false;
        optionCapacity.selected = true;
      }
    }
  }
})();
