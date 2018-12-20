'use strict';

/* Модуль работы с сетью */
/* Зависимости: picture.js, preview.js, util.js */

(function () {
  var URL_LOAD = 'https://js.dump.academy/kekstagram/data';
  var URL_SEND = 'https://js.dump.academy/kekstagram';

  var TIMEOUT_REQUEST = 10000;

  var ErrorMessage = {
    ANSWER_STATUS: 'Статус ответа: ',
    CONNECTION: 'Произошла ошибка соединения',
    TIMEOUT_BEGIN: 'Запрос не успел выполниться за ',
    TIMEOUT_END: 'мс'
  };

  var requestResultPopup = {
    DISPLAY_AREA: 'main',
    ERROR: 'error',
    SUCCESS: 'success',
    BUTTON: 'error__button',
  };

  var backendAction = function (onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(ErrorMessage.ANSWER_STATUS + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError(ErrorMessage.CONNECTION);
    });
    xhr.addEventListener('timeout', function () {
      onError(ErrorMessage.TIMEOUT_BEGIN + xhr.timeout + ErrorMessage.TIMEOUT_END);
    });

    xhr.timeout = TIMEOUT_REQUEST;

    if (typeof data === 'object') {
      xhr.open('POST', URL_SEND);
    } else {
      xhr.open('GET', URL_LOAD);
    }

    xhr.send(data);
  };

  var errorHandler = function () {
    var messageArea = document.querySelector(requestResultPopup.DISPLAY_AREA);
    var messageTemplate = document.querySelector('#' + requestResultPopup.ERROR)
        .content
        .querySelector('.' + requestResultPopup.ERROR);

    var fragment = document.createDocumentFragment();

    fragment.appendChild(messageTemplate);

    messageArea.appendChild(fragment);

    window.forms.close();

    messageArea.addEventListener('click', function (evt) {
      if (evt.target.className === requestResultPopup.ERROR || evt.target.className === requestResultPopup.BUTTON) {
        messageArea.removeChild(messageTemplate);
      }
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        messageArea.removeChild(messageTemplate);
      }
    });
  };

  window.backend = {
    action: backendAction,
    error: errorHandler
  };

})();
