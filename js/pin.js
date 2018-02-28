'use strict';

window.pin = (function () {
  var myAds;
  var pinNodes = [];
  var ENTER_KEYCODE = 13;
  var map = window.map.area;
  var mapPins = document.querySelector('.map__pins');
  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRoomNumber = mapFilters.querySelector('#housing-rooms');
  var housingGuestsNumber = mapFilters.querySelector('#housing-guests');
  var mapFilterSet = document.querySelector('.map__filter-set');
  var wifi = mapFilterSet.querySelector('#filter-wifi');
  var dishwasher = mapFilterSet.querySelector('#filter-dishwasher');
  var parking = mapFilterSet.querySelector('#filter-parking');
  var washer = mapFilterSet.querySelector('#filter-washer');
  var elevator = mapFilterSet.querySelector('#filter-elevator');
  var conditioner = mapFilterSet.querySelector('#filter-conditioner');
  var selectFilters = ['type', 'price', 'rooms', 'guests'];
  var checkboxFilters = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var filter = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    wifi: false,
    dishwasher: false,
    parking: false,
    washer: false,
    elevator: false,
    conditioner: false
  };

  mapFilters.addEventListener('change', function (evt) {
    if (map.querySelector('.map__card')) {
      window.card.closeDialog();
    }
    var target = evt.target;
    if (target.tagName === 'SELECT' || target.tagName === 'INPUT') {
      window.debounce(passAllFilters);
    }
  });

  function passAllFilters() {
    setFilterSelect(housingType, 'type');
    setFilterSelect(housingPrice, 'price');
    setFilterSelect(housingRoomNumber, 'rooms');
    setFilterSelect(housingGuestsNumber, 'guests');
    [wifi, dishwasher, parking, washer, elevator, conditioner].forEach(function (checkboxNode) {
      setFilterCheckBox(checkboxNode);
    });
    applyFilters();
  }

  function applyFilters() {
    myAds.forEach(function (item) {
      var itemCount = 0;
      var anyCount = 0;
      for (var prop in filter) {
        if (filter.hasOwnProperty(prop)) {
          if ((filter[prop] !== 'any') && (selectFilters.indexOf(prop) !== -1)) {
            if ((prop === 'price') && (priceFilter(filter[prop], item.offer.price))) {
              itemCount++;
            } else if (item.offer[prop].toString() === filter[prop].toString()) {
              itemCount++;
            }
          } else if (filter[prop] === 'any') {
            anyCount++;
          }
          if ((filter[prop] !== false) && (checkboxFilters.indexOf(prop) !== -1)) {
            if (item.offer.features.indexOf(prop) >= 0) {
              itemCount++;
            }
          } else if (filter[prop] === false) {
            anyCount++;
          }
        }
      }
      if ((anyCount + itemCount) === Object.keys(filter).length) {
        pinNodes[item.id].hidden = false;
      } else {
        pinNodes[item.id].hidden = true;
      }
    });
    pinNodes.filter(filterPins).forEach(function (value, index) {
      if (index >= 5) {
        value.hidden = true;
      }
    });
  }

  function filterPins(value) {
    return value.hidden === false;
  }

  function priceFilter(selectPrice, price) {
    switch (selectPrice) {
      case 'low':
        if (price < 10000) {
          return true;
        }
        break;
      case 'middle':
        if ((price >= 10000) && (price < 50000)) {
          return true;
        }
        break;
      case 'high':
        if (price >= 50000) {
          return true;
        }
        break;
      default:
        return false;
    }
    return '';
  }

  function setFilterCheckBox(property) {
    filter[property.value] = property.checked;
  }

  function setFilterSelect(filterSelect, filterProperty) {
    var select = filterSelect.options[filterSelect.selectedIndex];
    if (select.selected) {
      filter[filterProperty] = select.value;
    }
  }

  function addPins(cb1, cb2) {
    window.data.getAds(function (ads) {
      myAds = ads;
      mapPins.appendChild(getAdFragment(myAds));
      cb1();
      cb2();
    });
  }

  mapPins.addEventListener('click', function (evt) {
    movePin(evt);
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      movePin(evt);
    }
  });

  function getAdFragment(ads) {
    var fragmentAd = document.createDocumentFragment();

    ads.forEach(function (ad, index) {
      var newElement = document.createElement('button');
      ad.id = index;
      newElement.className = 'map__pin';
      newElement.style.left = ad.location.x + 'px';
      newElement.style.top = ad.location.y + 'px';
      var avatar = new Image(40, 40);
      avatar.className = 'rounded';
      avatar.tabIndex = '0';
      avatar.src = ad.author.avatar;
      newElement.appendChild(avatar);
      newElement.dataset.id = index;
      pinNodes.push(newElement);
      fragmentAd.appendChild(newElement);
    });
    return fragmentAd;
  }

  function removePinActive() {
    if (!myAds) {
      return;
    }
    var activeId = myAds.find(getActivePin).id;
    myAds[activeId].isActive = false;
    pinNodes[activeId].classList.remove('pin--active');
  }

  function movePin(evt) {
    if (!myAds) {
      return;
    }
    var targetPin = evt.target;
    var targetId = targetPin.parentNode.dataset.id;
    var activePin = myAds.find(getActivePin);
    if (targetId) {
      if (activePin) {
        window.card.closeDialog();
      }
      myAds[targetId].isActive = true;
      pinNodes[targetId].classList.add('pin--active');
      window.showCard(myAds[targetId]);
    }
  }

  function getActivePin(item) {
    return item.isActive === true;
  }

  return {
    removePinActive: removePinActive,
    passAllFilters: passAllFilters,
    addPins: addPins
  };
})();
