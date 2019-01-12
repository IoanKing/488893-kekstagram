'use strict';

/* Модуль для работы с формой */
/* Зависимости: util.js */

(function () {

  var ScaleSettings = {
    SCALE_MAX: 100,
    SCALE_MIN: 25,
    SCALE_STEP: 25,
    SCALE_DEFAULT: 100,
  };

  var Effects = {
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

  var EFFECTS_LIST = Object.keys(Effects);
  var FILTER_DEFAULT = 100;
  var SCALE_DEFAULT = 55;

  var Selectors = {
    EDITOR_CLOSE: '.img-upload__cancel',

    PREVIEW: '.img-upload__preview',
    IMAGE_PREVIEW: '.img-upload__preview > img',
    IMAGE_FILTER: '.effects__radio',

    UPLOAD_FILE: '#upload-file',
    EDITOR_FORM: '.img-upload__overlay',
    EFFECT_PREVIEW: 'effects__preview',

    SCALE_SMALLER: '.scale__control--smaller',
    SCALE_BIGGER: '.scale__control--bigger',
    SCALE_VALUE: '.scale__control--value',
    SLIDER: '.img-upload__effect-level',
    EFFECT_ITEM: '.effects__item',
    EFFECT_LEVEL: 'input[name="effect-level"]',
    EFFECT_LEVEL_LINE: '.effect-level__line',
    EFFECT_LEVEL_PIN: '.effect-level__pin',
    EFFECT_LEVEL_DEPTH: '.effect-level__depth',

    VALIDATION_DESCRIPTION: '.text__description',
    VALIDATION_HASHTAGS: '.text__hashtags',

    UPLOAD_FORM: '#upload-select-image'
  };

  var Classes = {
    HIDDEN_CLASS: 'hidden',
    EFFECT_PREVIEW: 'effects__preview',
  };

  var imagePreviews = document.querySelector(Selectors.IMAGE_PREVIEW);
  var imageEffects = document.querySelectorAll(Selectors.IMAGE_FILTER);
  var slider = document.querySelector(Selectors.SLIDER);
  var scaleImgValue = document.querySelector(Selectors.SCALE_VALUE);

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
    var effectLevel = document.querySelector(Selectors.EFFECT_LEVEL);

    var levelPin = document.querySelector(Selectors.EFFECT_LEVEL_PIN);
    var levelDepth = document.querySelector(Selectors.EFFECT_LEVEL_DEPTH);

    var filter = Effects[effect.toUpperCase()];
    var proportion = getProportion(filter.min, filter.max, 1);
    var proportionUndo = getProportion(filter.min, filter.max, 0);

    var valueFilter = Math.max(filter.min, Math.min(proportion * value + filter.min, filter.max));
    var valueFilterInPercent = Math.round((valueFilter - filter.min) * proportionUndo);

    element.style.filter = getFilter(filter.filter, valueFilter, filter.unit);
    effectLevel.setAttribute('value', valueFilterInPercent);

    levelPin.style.left = valueFilterInPercent + '%';
    levelDepth.style.width = valueFilterInPercent + '%';
  };

  var onCloseForm = function () {
    window.util.closePopup(Selectors.EDITOR_FORM);
    uploadPicture.reset();

    imagePreviews.style = '';
    document.querySelector(Selectors.EFFECT_LEVEL)
            .setAttribute('value', FILTER_DEFAULT);
    document.querySelector(Selectors.EFFECT_LEVEL_PIN)
            .style.left = FILTER_DEFAULT + '%';
    document.querySelector(Selectors.EFFECT_LEVEL_DEPTH)
            .style.width = FILTER_DEFAULT + '%';
    document.querySelector(Selectors.SCALE_VALUE)
            .setAttribute('value', SCALE_DEFAULT);
    // setClassEffect(imagePreviews, 'none');
    document.querySelector(Selectors.SLIDER)
            .classList.add(Classes.HIDDEN_CLASS);
  };

  var setEffectSlider = function (value) {
    var elementEffect = imagePreviews.getAttribute('class');
    var effect = elementEffect.substring(elementEffect.lastIndexOf('--') + 2, elementEffect.length);

    renderEffect(imagePreviews, effect, value);
  };

  var setClassEffect = function (element, effect) {
    for (var i = 0; i < EFFECTS_LIST.length; i++) {
      element.classList.remove(Selectors.EFFECT_PREVIEW + '--' + EFFECTS_LIST[i].toLowerCase());
      if (effect === EFFECTS_LIST[i].toLowerCase()) {
        element.classList.add(Selectors.EFFECT_PREVIEW + '--' + effect);
      }
    }
  };

  var onMouseDown = function (evt) {
    evt.preventDefault();

    var effectLine = evt.currentTarget.querySelector(Selectors.EFFECT_LEVEL_LINE);
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
    /* modificator: Increase = 1, decrease = -1, nothing = 0  */
    var scaleValue = parseInt(scaleImgValue.getAttribute('value'), 10);
    var changedValue = (modificator === 100) ? ScaleSettings.SCALE_DEFAULT : Math.max(ScaleSettings.SCALE_MIN, Math.min(scaleValue + ScaleSettings.SCALE_STEP * modificator, ScaleSettings.SCALE_MAX));

    scaleImgValue.setAttribute('value', changedValue.toString() + '%');
    imagePreviews.style.transform = 'scale(' + changedValue / 100 + ')';
  };

  /* ------- OPEN EDITOR FORM -------- */

  var openEditor = document.querySelector(Selectors.UPLOAD_FILE);
  openEditor.addEventListener('change', function () {
    window.util.openPopup(Selectors.EDITOR_FORM);

    var closeEditor = document.querySelector(Selectors.EDITOR_CLOSE);
    closeEditor.addEventListener('click', function () {
      window.util.closePopup(Selectors.EDITOR_FORM);
      openEditor.value = '';
    });
  });

  var setEffect = function (effect) {
    setClassEffect(imagePreviews, effect);
    renderEffect(imagePreviews, effect, FILTER_DEFAULT);
    if (effect !== EFFECTS_LIST[EFFECTS_LIST.length - 1].toLowerCase()) {
      slider.classList.remove(Classes.HIDDEN_CLASS);
    } else {
      slider.classList.add(Classes.HIDDEN_CLASS);
    }
  };

  /* ------- CHANGE EFFECTS -------- */

  setEffect('none');

  imageEffects.forEach(function (element) {
    element.addEventListener('click', function () {
      var effect = element.getAttribute('value');
      setEffect(effect);
    });
  });

  slider.addEventListener('mousedown', onMouseDown);

  /* --------------- SCALE -----------------*/

  var buttonScaleDecrease = document.querySelector(Selectors.SCALE_SMALLER);
  var buttonScaleIncrease = document.querySelector(Selectors.SCALE_BIGGER);

  setScale(0);

  buttonScaleDecrease.addEventListener('click', function () {
    setScale(-1);
  });

  buttonScaleIncrease.addEventListener('click', function () {
    setScale(1);
  });

  /* --------------- VALIDATION -----------------*/

  var hashtagInput = document.querySelector(Selectors.VALIDATION_HASHTAGS);

  hashtagInput.addEventListener('input', function (evt) {
    var target = evt.target;
    var parsedHashtags = target.value.split(/\s+/);
    var validation = window.validation.getValidationHashtags(parsedHashtags);
    evt.target.setCustomValidity(validation);
  });

  var descriptionInput = document.querySelector(Selectors.VALIDATION_DESCRIPTION);

  descriptionInput.setAttribute('maxlength', window.validation.MAX_LENGTH);

  /* --------------- SEND DATA To SERVER -----------------*/

  var uploadPicture = document.querySelector(Selectors.UPLOAD_FORM);

  uploadPicture.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.action(onCloseForm, window.backend.error, new FormData(uploadPicture));
  });

  window.forms = {
    close: onCloseForm,
    setEffect: setEffect,
    setScale: setScale
  };

})();
