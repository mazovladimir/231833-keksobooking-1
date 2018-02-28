'use strict';

window.data = (function () {
  document.querySelector('.map__filters-container').style.display = 'none';
  var myAds = [];

  function getAds(onLoadAds) {
    if (myAds.length) {
      onLoadAds(myAds);
    } else {
      window.backend.get('/data', onLoadAds);
    }
  }

  return {
    getAds: getAds
  };
})();
