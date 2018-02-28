'use strict';

window.backend = (function () {
  var SERVER_URL = 'https://js.dump.academy/keksobooking';

  function setup(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(xhr.response);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    return xhr;
  }

  function post(url, data, onLoad, onError) {
    var xhr = setup(onLoad, onError);
    xhr.open('POST', SERVER_URL + url);
    xhr.send(data);
  }

  function get(url, onLoad, onError) {
    var xhr = setup(onLoad, onError);
    xhr.open('GET', SERVER_URL + url);
    xhr.send();
  }

  return {
    post: post,
    get: get
  };
})();
