'use strict';

/* Модуль работы с сетью */
/* Зависимости: constants.js */

(function () {
  var URL_LOAD = 'https://js.dump.academy/kekstagram/data';
  var URL_SEND = 'https://js.dump.academy/kekstagram';

  var TIMEOUT_REQUEST = 10000;
  var VISUALLY_HIDDEN = 'visually-hidden';

  var errorBlock = {
    BLOCK: 'div',
    STYLE: 'z-index: 100; margin: 0 auto; text-align: center; background-color: red; padding: 10px;',
    POSITION: 'absolute',
    LEFT: 0,
    RIGHT: 0,
    FONT_SIZE: '30px',
  };

  var ErrorText = {
    ANSWER_STATUS: 'Не удалось получить данные: ',
    CONNECTION: 'Произошла ошибка соединения',
    TIMEOUT_BEGIN: 'Запрос не успел выполниться за ',
    TIMEOUT_END: 'мс'
  };

  var executionRequest = function (onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(ErrorText.ANSWER_STATUS + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError(ErrorText.CONNECTION);
    });
    xhr.addEventListener('timeout', function () {
      onError(ErrorText.TIMEOUT_BEGIN + xhr.timeout + ErrorText.TIMEOUT_END);
    });

    xhr.timeout = TIMEOUT_REQUEST;

    if (typeof data === 'object') {
      xhr.open('POST', URL_SEND);
    } else {
      xhr.open('GET', URL_LOAD);
    }

    xhr.send(data);
  };

  var renderSendPopup = function (status) {
    var messageArea = document.querySelector(window.ElementSelector.MAIN);
    var statusIdSelector = '#' + status;
    var statusClassSelector = '.' + status;
    var messageTemplate = document.querySelector(statusIdSelector)
        .content
        .querySelector(statusClassSelector);

    messageTemplate.classList.add(VISUALLY_HIDDEN);

    var fragment = document.createDocumentFragment();
    fragment.appendChild(messageTemplate);
    messageArea.appendChild(fragment);

    return messageTemplate;
  };

  var successMessage = renderSendPopup(window.ElementClass.SUCCESS);
  var errorMessage = renderSendPopup(window.ElementClass.ERROR);

  var onConnectionError = function (message) {
    var node = document.createElement(errorBlock.BLOCK);
    node.style = errorBlock.STYLE;
    node.style.position = errorBlock.POSITION;
    node.style.left = errorBlock.LEFT;
    node.style.right = errorBlock.RIGHT;
    node.style.fontSize = errorBlock.FONT_SIZE;

    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend = {
    onSendData: executionRequest,
    onLoadData: executionRequest,
    onConnectionError: onConnectionError,
    successMessage: successMessage,
    errorMessage: errorMessage
  };

})();
