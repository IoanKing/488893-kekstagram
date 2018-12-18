'use strict';

/* Модуль для работы с формой */
/* Зависимости: util.js */

(function () {

  var ScaleSettings = {
    SCALE_MAX: 100,
    SCALE_MIN: 25,
    SCALE_STEP: 25,
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
  };

  var Classes = {
    HIDDEN_CLASS: 'hidden',
    EFFECT_PREVIEW: 'effects__preview',
  };

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

  var setEffect = function (element, effect, value) {
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

  var setEffectSlider = function (value) {
    var imagePreviews = document.querySelector(Selectors.IMAGE_PREVIEW);

    var elementEffect = imagePreviews.getAttribute('class');
    var effect = elementEffect.substring(elementEffect.lastIndexOf('--') + 2, elementEffect.length);

    setEffect(imagePreviews, effect, value);
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

  var setScale = function (element, valueAttribute, modificator) {
    /* modificator: Increase = 1, decrease = -1, nothing = 0  */
    var scaleValue = parseInt(valueAttribute.getAttribute('value'), 10);
    var changedValue = Math.max(ScaleSettings.SCALE_MIN, Math.min(scaleValue + ScaleSettings.SCALE_STEP * modificator, ScaleSettings.SCALE_MAX));

    valueAttribute.setAttribute('value', changedValue.toString() + '%');
    element.style.transform = 'scale(' + changedValue / 100 + ')';
  };

  /* ------- OPEN EDITOR FORM -------- */

  var openEditor = document.querySelector(Selectors.UPLOAD_FILE);
  openEditor.addEventListener('change', function () {
    window.util.openPopup(Selectors.EDITOR_FORM, Selectors.EDITOR_FORM);

    var closeEditor = document.querySelector(Selectors.EDITOR_CLOSE);
    closeEditor.addEventListener('click', function () {
      window.util.closePopup(Selectors.EDITOR_FORM, Selectors.EDITOR_FORM);
      openEditor.value = '';
    });
  });

  /* ------- CHANGE EFFECTS -------- */

  var imagePreviews = document.querySelector(Selectors.IMAGE_PREVIEW);
  var imageEffects = document.querySelectorAll(Selectors.IMAGE_FILTER);

  var slider = document.querySelector(Selectors.SLIDER);

  slider.classList.add(Classes.HIDDEN_CLASS);

  imageEffects.forEach(function (element) {
    element.addEventListener('click', function () {
      var effect = element.getAttribute('value');
      setClassEffect(imagePreviews, effect);
      setEffect(imagePreviews, effect, FILTER_DEFAULT);
      if (effect !== EFFECTS_LIST[EFFECTS_LIST.length - 1].toLowerCase()) {
        slider.classList.remove(Classes.HIDDEN_CLASS);
      } else {
        slider.classList.add(Classes.HIDDEN_CLASS);
      }
    });
  });

  slider.addEventListener('mousedown', onMouseDown);

  /* --------------- SCALE -----------------*/

  var scaleImgValue = document.querySelector(Selectors.SCALE_VALUE);
  var buttonScaleDecrease = document.querySelector(Selectors.SCALE_SMALLER);
  var buttonScaleIncrease = document.querySelector(Selectors.SCALE_BIGGER);

  setScale(imagePreviews, scaleImgValue, 0);

  buttonScaleDecrease.addEventListener('click', function () {
    setScale(imagePreviews, scaleImgValue, -1);
  });

  buttonScaleIncrease.addEventListener('click', function () {
    setScale(imagePreviews, scaleImgValue, 1);
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

})();
