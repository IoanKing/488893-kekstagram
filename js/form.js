'use strict';

/* Модуль для работы с формой */
/* Зависимости: constants.js, util.js, backend.js, validation.js */

(function () {

  var ScaleSetting = {
    SCALE_MAX: 100,
    SCALE_MIN: 25,
    SCALE_STEP: 25,
    SCALE_DEFAULT: 100
  };

  var FILTER_DEFAULT = 100;

  var filterEffect = {
    CHROME: {
      filter: 'grayscale',
      min: 0,
      max: 1,
      unit: '',
    },
    SEPIA: {
      filter: 'sepia',
      min: 0,
      max: 1,
      unit: '',
    },
    MARVIN: {
      filter: 'invert',
      min: 0,
      max: 100,
      unit: '%',
    },
    PHOBOS: {
      filter: 'blur',
      min: 1,
      max: 3,
      unit: 'px',
    },
    HEAT: {
      filter: 'brightness',
      min: 1,
      max: 3,
      unit: '',
    },
    NONE: {
      filter: '',
      min: 1,
      max: 1,
      unit: '',
    },
  };

  var effectLists = Object.keys(filterEffect);

  var preview = document.querySelector(window.ElementSelector.IMAGE_PREVIEW);
  var effectList = document.querySelectorAll(window.ElementSelector.IMAGE_FILTER);
  var slider = document.querySelector(window.ElementSelector.SLIDER);
  var scaleImgValue = document.querySelector(window.ElementSelector.SCALE_VALUE);

  var effectLevel = document.querySelector(window.ElementSelector.EFFECT_LEVEL);
  var levelPin = document.querySelector(window.ElementSelector.EFFECT_LEVEL_PIN);
  var levelDepth = document.querySelector(window.ElementSelector.EFFECT_LEVEL_DEPTH);
  var scaleValue = document.querySelector(window.ElementSelector.SCALE_VALUE);

  /* ------------- FUNCTIONS --------------- */

  var getProportion = function (min, max, modificator) {
    return (modificator) ? ((max - min) / 100) : (100 / (max - min));
  };

  var getFilter = function (filter, value, unit) {
    return (filter) ? filter + '(' + value + unit + ')' : '';
  };

  var getPercent = function (newValue, minValue, maxValue) {
    return Math.round((Math.min(Math.max(newValue - minValue, 0), maxValue + minValue) / maxValue) * 100);
  };

  var renderEffect = function (element, effect, value) {
    var filter = filterEffect[effect.toUpperCase()];
    var proportion = getProportion(filter.min, filter.max, 1);
    var proportionUndo = getProportion(filter.min, filter.max, 0);

    var valueFilter = Math.max(filter.min, Math.min(proportion * value + filter.min, filter.max));
    var valueFilterInPercent = Math.round((valueFilter - filter.min) * proportionUndo);

    element.style.filter = getFilter(filter.filter, valueFilter, filter.unit);
    effectLevel.setAttribute('value', valueFilterInPercent);

    levelPin.style.left = valueFilterInPercent + '%';
    levelDepth.style.width = valueFilterInPercent + '%';
  };

  var showSendResult = function (status) {
    switch (status) {
      case window.ElementSelector.SUCCESS:
        window.backend.successMessage.classList.remove(window.ElementClass.VISUALLY_HIDDEN);
        break;
      case window.ElementSelector.ERROR:
        window.backend.errorMessage.classList.remove(window.ElementClass.VISUALLY_HIDDEN);
        break;
      default:
        break;
    }

    var removeResultMessage = function () {
      window.backend.successMessage.classList.add(window.ElementClass.VISUALLY_HIDDEN);
      window.backend.errorMessage.classList.add(window.ElementClass.VISUALLY_HIDDEN);
      document.removeEventListener('click', onClickClose);
      document.removeEventListener('keydown', onKeydownClose);
    };

    var onClickClose = function (evt) {
      var buttonClass = status + window.ElementSelector.BUTTON;
      if (evt.target.className !== status || evt.target.className === buttonClass) {
        removeResultMessage();
      }
    };

    var onKeydownClose = function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        removeResultMessage();
      }
    };

    document.addEventListener('click', onClickClose);
    document.addEventListener('keydown', onKeydownClose);
  };

  var resetPicture = function () {
    uploadPicture.reset();
    preview.style = '';
    effectLevel.setAttribute('value', FILTER_DEFAULT);
    levelPin.style.left = FILTER_DEFAULT + '%';
    levelDepth.style.width = FILTER_DEFAULT + '%';
    scaleValue.setAttribute('value', ScaleSetting.SCALE_DEFAULT);
    slider.classList.add(window.ElementClass.HIDDEN);
  };

  var onCloseForm = function () {
    window.util.closePopup(window.ElementSelector.EDITOR_FORM);
    resetPicture();
    showSendResult(window.ElementSelector.SUCCESS);
  };

  var onErrorForm = function () {
    window.util.closePopup(window.ElementSelector.EDITOR_FORM);
    resetPicture();
    showSendResult(window.ElementSelector.ERROR);
  };

  var setEffectSlider = function (value) {
    var elementEffect = preview.getAttribute('class');
    var effect = elementEffect.substring(elementEffect.lastIndexOf('--') + 2, elementEffect.length);

    renderEffect(preview, effect, value);
  };

  var setClassEffect = function (element, effect) {
    for (var i = 0; i < effectLists.length; i++) {
      element.classList.remove(window.ElementSelector.EFFECT_PREVIEW + '--' + effectLists[i].toLowerCase());
      if (effect === effectLists[i].toLowerCase()) {
        element.classList.add(window.ElementSelector.EFFECT_PREVIEW + '--' + effect);
      }
    }
  };

  var onMouseDown = function (evt) {
    evt.preventDefault();

    var effectLine = evt.currentTarget.querySelector(window.ElementSelector.EFFECT_LEVEL_LINE);
    var effectLineCoord = effectLine.getBoundingClientRect();

    var pinValue = getPercent(evt.clientX, effectLineCoord.x, effectLineCoord.width);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      pinValue = getPercent(moveEvt.clientX, effectLineCoord.x, effectLineCoord.width);

      setEffectSlider(pinValue);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      setEffectSlider(pinValue);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var setScale = function (modificator) {
    /* modificator: Increase = 1, decrease = -1, default = 0  */
    var currentValue = parseInt(scaleImgValue.getAttribute('value'), 10);
    var changedValue = (modificator === 0) ? ScaleSetting.SCALE_DEFAULT : Math.max(ScaleSetting.SCALE_MIN, Math.min(currentValue + ScaleSetting.SCALE_STEP * modificator, ScaleSetting.SCALE_MAX));

    scaleImgValue.setAttribute('value', changedValue.toString() + '%');
    preview.style.transform = 'scale(' + changedValue / 100 + ')';
  };

  /* ------- OPEN EDITOR FORM -------- */

  var openEditor = document.querySelector(window.ElementSelector.UPLOAD_FILE);
  openEditor.addEventListener('change', function () {
    window.util.openPopup(window.ElementSelector.EDITOR_FORM);

    var closeEditor = document.querySelector(window.ElementSelector.EDITOR_CLOSE);
    closeEditor.addEventListener('click', function () {
      window.util.closePopup(window.ElementSelector.EDITOR_FORM);
      openEditor.value = '';
    });
  });

  var setEffect = function (effect) {
    setClassEffect(preview, effect);
    renderEffect(preview, effect, FILTER_DEFAULT);
    if (effect !== effectLists[effectLists.length - 1].toLowerCase()) {
      slider.classList.remove(window.ElementClass.HIDDEN);
    } else {
      slider.classList.add(window.ElementClass.HIDDEN);
    }
  };

  /* ------- CHANGE EFFECTS -------- */

  setEffect('none');

  effectList.forEach(function (element) {
    element.addEventListener('click', function () {
      var effect = element.getAttribute('value');
      setEffect(effect);
    });
  });

  slider.addEventListener('mousedown', onMouseDown);

  /* --------------- SCALE -----------------*/

  var buttonScaleDecrease = document.querySelector(window.ElementSelector.SCALE_SMALLER);
  var buttonScaleIncrease = document.querySelector(window.ElementSelector.SCALE_BIGGER);

  buttonScaleDecrease.addEventListener('click', function () {
    setScale(-1);
  });

  buttonScaleIncrease.addEventListener('click', function () {
    setScale(1);
  });

  /* --------------- VALIDATION -----------------*/

  var hashtagInput = document.querySelector(window.ElementSelector.VALIDATION_HASHTAGS);

  hashtagInput.addEventListener('input', function (evt) {
    var target = evt.target;
    var parsedHashtags = target.value.split(/\s+/);
    var validation = window.validation.validateHashtags(parsedHashtags);
    target.style.outline = (validation) ? window.validation.ERROR_OUTLINE : '';
    target.setCustomValidity(validation);
  });

  var descriptionInput = document.querySelector(window.ElementSelector.VALIDATION_DESCRIPTION);

  descriptionInput.setAttribute('maxlength', window.validation.MAX_LENGTH);

  /* --------------- SEND DATA To SERVER -----------------*/

  var uploadPicture = document.querySelector(window.ElementSelector.UPLOAD_FORM);

  uploadPicture.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.onSendData(onCloseForm, onErrorForm, new FormData(uploadPicture));
  });

  window.forms = {
    setEffect: setEffect,
    setScale: setScale
  };

})();
