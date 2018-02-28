'use strict';

window.card = (function () {
  var removePinActive = window.pin.removePinActive;
  var ESC_KEYCODE = 27;
  var map = window.map.area;
  var mapFilterContainer = map.querySelector('.map__filters-container');

  function getType(type) {
    switch (type) {
      case 'flat':
        return 'Квартира';
      case 'house':
        return 'Дом';
      case 'bungalo':
        return 'Бунгало';
    }
    return '';
  }

  function renderAd(ad) {
    var fragmentFeature = document.createDocumentFragment();
    var fragmentFeature1 = document.createDocumentFragment();
    var adsTemplate = document.querySelector('template').content.querySelector('.map__card');
    var adsElement = adsTemplate.cloneNode(true);
    var popupPictures = adsElement.querySelector('.popup__pictures');
    ad.offer.features.forEach(function (feature) {
      var fElement = document.createElement('li');
      fElement.className = 'feature feature--' + feature;
      fragmentFeature.appendChild(fElement);
    });
    ad.offer.photos.forEach(function (photo) {
      var pElement = popupPictures.querySelector('li').cloneNode(true);
      pElement.querySelector('img').style.width = '50px';
      pElement.querySelector('img').style.height = '50px';
      pElement.querySelector('img').src = photo;
      fragmentFeature1.appendChild(pElement);
    });
    adsElement.querySelector('.popup__avatar').src = ad.author.avatar;
    adsElement.querySelector('h3').textContent = ad.offer.title;
    adsElement.querySelector('h3 + p').textContent = ad.offer.address;
    adsElement.querySelector('.popup__price').textContent = ad.offer.price + '\u20BD' + '/ночь';
    adsElement.querySelector('h4').textContent = getType(ad.offer.type);
    adsElement.querySelector('h4 + p').textContent = 'Для ' + ad.offer.guests + ' гостей в ' + ad.offer.rooms + ' комнатах';
    adsElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    adsElement.querySelector('.popup__features').querySelectorAll('li').forEach(function (item) {
      item.remove();
    });
    adsElement.querySelector('.popup__features').appendChild(fragmentFeature);
    adsElement.querySelector('.popup__features + p').textContent = ad.offer.description;
    adsElement.querySelector('.popup__pictures').appendChild(fragmentFeature1);
    adsElement.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);
    document.addEventListener('keyup', onPopupEscPress);
    return adsElement;
  }

  function onPopupEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeDialog();
    }
  }

  function onPopupCloseClick() {
    closeDialog();
  }

  function closeDialog() {
    removePinActive();
    map.querySelector('.map__card').remove();
    document.removeEventListener('click', onPopupCloseClick);
    document.removeEventListener('keyup', onPopupEscPress);
  }

  function replacePinDialog(myAd) {
    var mapCard = map.querySelector('.map__card');
    if (mapCard === null) {
      map.insertBefore(renderAd(myAd), mapFilterContainer);
    }
  }

  return {
    closeDialog: closeDialog,
    replacePinDialog: replacePinDialog
  };
})();
