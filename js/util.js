'use strict';

/* Модуль с общими функциями */
/* Зависимости: constants.js */

(function () {

  var DEBOUNCE_INTERVAL = 500; // ms

  var Shortcut = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
  };

  var closePopup = function (element, additionalElement) {
    var closureElement = document.querySelector(element);
    closureElement.classList.add(window.ElementClass.HIDDEN);
    if (additionalElement) {
      var closureAdditionalForm = document.querySelector(additionalElement);
      closureAdditionalForm.classList.remove(window.ElementClass.MODAL_OPEN_CLASS);
    }
  };

  var openPopup = function (element, additionalElement) {
    var openingElement = document.querySelector(element);
    openingElement.classList.remove(window.ElementClass.HIDDEN);
    if (additionalElement) {
      var openingAdditionalForm = document.querySelector(additionalElement);
      openingAdditionalForm.classList.add(window.ElementClass.MODAL_OPEN_CLASS);
    }
    var onKeydownEsc = function (evt) {
      var curentActiveElement = document.activeElement;
      var hasNoFocus = (curentActiveElement.classList.contains(window.ElementClass.HASHTAGS_FOCUS) || curentActiveElement.classList.contains(window.ElementClass.DESCRIPTION_FOCUS) || curentActiveElement.classList.contains(window.ElementClass.COMMENT_FOCUS)) ? false : true;
      if (evt.keyCode === Shortcut.ESC_KEYCODE && hasNoFocus) {
        onClose();
      }
    };
    var onClose = function () {
      closePopup(element, additionalElement);
      document.removeEventListener('keydown', onKeydownEsc);
    };
    document.addEventListener('keydown', onKeydownEsc);
  };

  var removeChildren = function (parent, element) {
    for (var i = 0; i < element.length; i++) {
      parent.removeChild(element[i]);
    }
  };

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    ESC_KEYCODE: Shortcut.ESC_KEYCODE,
    ENTER_KEYCODE: Shortcut.ENTER_KEYCODE,
    closePopup: closePopup,
    openPopup: openPopup,
    removeChildren: removeChildren,
    debounce: debounce
  };
})();
