'use strict';

/* Модуль с общими функциями */
/* Зависимости: util.js */

(function () {

  var DEBOUNCE_INTERVAL = 500; // ms

  var utilClasses = {
    HIDDEN_CLASS: 'hidden',
    MODAL_OPEN_CLASS: 'modal-open',
    HASHTAGS_FOCUS: 'text__hashtags',
    DESCRIPTION_FOCUS: 'text__description',
    COMMENT_FOCUS: 'social__footer-text',
  };

  var Shortcuts = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
  };

  var closePopup = function (element, additionalElement) {
    var closureElement = document.querySelector(element);
    closureElement.classList.add(utilClasses.HIDDEN_CLASS);
    if (additionalElement) {
      var closureAdditionalForm = document.querySelector(additionalElement);
      closureAdditionalForm.classList.remove(utilClasses.MODAL_OPEN_CLASS);
    }
  };

  var openPopup = function (element, additionalElement) {
    var openingElement = document.querySelector(element);
    openingElement.classList.remove(utilClasses.HIDDEN_CLASS);
    if (additionalElement) {
      var openingAdditionalForm = document.querySelector(additionalElement);
      openingAdditionalForm.classList.add(utilClasses.MODAL_OPEN_CLASS);
    }
    var onKeydownEsc = function (evt) {
      var curentActiveElement = document.activeElement;
      var hasNoFocus = (curentActiveElement.classList.contains(utilClasses.HASHTAGS_FOCUS) || curentActiveElement.classList.contains(utilClasses.DESCRIPTION_FOCUS) || curentActiveElement.classList.contains(utilClasses.COMMENT_FOCUS)) ? false : true;
      if (evt.keyCode === window.util.ESC_KEYCODE && hasNoFocus) {
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
    ESC_KEYCODE: Shortcuts.ESC_KEYCODE,
    ENTER_KEYCODE: Shortcuts.ENTER_KEYCODE,
    closePopup: closePopup,
    openPopup: openPopup,
    removeChildren: removeChildren,
    debounce: debounce
  };
})();
