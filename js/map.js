'use strict';

window.map = (function () {
  var MIN_Y = 150;
  var MAX_Y = 500;
  var address = document.querySelector('#address');
  var pinMain = document.querySelector('.map__pin--main');
  var area = document.querySelector('.map');
  var areaRect = area.getBoundingClientRect();
  var pinRect = pinMain.getBoundingClientRect();
  var form = document.querySelector('.notice__form');
  var mapFiltersForm = document.querySelector('.map__filters');
  var startCoords;
  var pinMainX = areaRect.width / 2;
  var pinMainY = areaRect.height / 2;

  pinMain.style.transform = 'translate(0,0)';

  setPinPosition(pinMainX, pinMainY);
  pinMain.style.zIndex = 2;

  address.value = 'x:' + Math.round(pinMainX) + ', y:' + Math.round(pinMainY);
  address.readOnly = true;

  pinMain.addEventListener('mousedown', onMouseDown);

  address.addEventListener('input', onInputParseAddress);

  pinMain.addEventListener('mouseup', function () {
    if (document.querySelector('.map--faded')) {
      onMouseUpDisplay();
    }
  });

  function onMouseUpDisplay() {
    area.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    var fieldSets = form.querySelectorAll('fieldset');
    fieldSets.forEach(function (field) {
      field.disabled = false;
    });
    window.pin.addPins(showMapFilters, window.pin.passAllFilters);
  }

  function showMapFilters() {
    document.querySelector('.map__filters-container').style.display = '';
  }

  function resetForm() {
    form.reset();
    mapFiltersForm.reset();
    area.classList.add('map--faded');
    form.classList.add('notice__form--disabled');
    removeChildPins();
    if (area.querySelector('.map__card')) {
      window.card.closeDialog();
    }
    pinMainX = areaRect.width / 2;
    pinMainY = areaRect.height / 2;
    setPinPosition(pinMainX, pinMainY);
    address.value = 'x:' + Math.round(pinMainX) + ', y:' + Math.round(pinMainY);
  }

  function removeChildPins() {
    var childPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    childPins.forEach(function (item) {
      item.hidden = true;
    });
  }

  function setPinPosition(x, y) {
    pinMain.style.top = y - pinRect.height + 'px';
    pinMain.style.left = x - pinRect.width / 2 + 'px';
  }

  function onInputParseAddress() {
    var parsedAddress = address.value.match(/x:\s*(\d+),\s*y:\s*(\d+)/);
    if (parsedAddress[1] && parsedAddress[2]) {
      setPinPosition(+parsedAddress[1], +parsedAddress[2]);
    }
  }

  function getRangeValue(value, min, max) {
    return Math.max(Math.min(value, max), min);
  }

  function attachEvents() {
    area.addEventListener('mousemove', onMouseMove);
    area.addEventListener('mouseup', onMouseUp);
    area.addEventListener('mouseleave', onMouseUp);
  }

  function detachEvents() {
    area.removeEventListener('mousemove', onMouseMove);
    area.removeEventListener('mouseup', onMouseUp);
    area.removeEventListener('mouseleave', onMouseUp);
  }

  function onMouseDown(evt) {
    evt.preventDefault();
    attachEvents();
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
  }

  function onMouseMove(moveEvt) {
    moveEvt.preventDefault();
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    pinMainX = getRangeValue(pinMainX - shift.x, 0, areaRect.width);
    pinMainY = getRangeValue(pinMainY - shift.y, MIN_Y, MAX_Y);

    setPinPosition(pinMainX, pinMainY);

    address.value = 'x:' + Math.round(pinMainX) + ', y:' + Math.round(pinMainY);
    return '';
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();
    detachEvents();
  }

  return {
    resetForm: resetForm,
    removeChildPins: removeChildPins,
    onMouseUpDisplay: onMouseUpDisplay,
    area: area
  };
})();
