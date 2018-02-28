'use strict';

window.showCard = (function () {
  return function (ad) {
    window.card.replacePinDialog(ad);
  };
})();
