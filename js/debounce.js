'use strict';
window.debounce = (function () {
  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;
  return function debounce(fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };
})();
