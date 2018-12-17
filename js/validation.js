'use strict';

/* Модуль валидации формы */
/* Зависимости: нет */

(function () {

  var validationSelector = {
    DESCRIPTION: '.text__description',
    HASHTAGS: '.text__hashtags',
  };

  var ValidationHashtag = {
    FIRST_SYMBOL: '#',
    MAX_LENGTH: 20,
    MAX_TAGS: 5,
  };

  var ValidationDescription = {
    MAX_LENGTH: 140,
  };

  var ValidationMessage = {
    ERROR_SYMBOL: 'Хеш теги должны начинатся с символа ' + ValidationHashtag.FIRST_SYMBOL + '.',
    ERROR_MINLENGTH: 'Хеш-тег не может состоять только из одного символа ' + ValidationHashtag.FIRST_SYMBOL + '.',
    ERROR_MAXLENGTH: 'Максимальная длина одного хэш-тега ' + ValidationHashtag.MAX_LENGTH + ' символов, включая решётку.',
    ERROR_DUBLICATES: 'Один и тот же хэш-тег не может быть использован дважды.',
    ERROR_SPACES: 'Хэш-теги разделяются пробелами.',
    ERROR_MAXHASHTAGS: 'Нельзя указать больше ' + ValidationHashtag.MAX_TAGS + ' хэш-тегов.',
  };

  var checkNonUniqueness = function (collection) {
    var unifiedCollection = collection.map(function (element) {
      return element.toLowerCase();
    });
    for (var i = 0; i < unifiedCollection.length - 1; i++) {
      for (var k = i + 1; k < unifiedCollection.length; k++) {
        if (unifiedCollection[i] === unifiedCollection[k]) {
          return true;
        }
      }
    }
    return false;
  };

  var getValidationHashtags = function (hashtags) {
    var unique = checkNonUniqueness(hashtags);
    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags[i][0] !== ValidationHashtag.FIRST_SYMBOL) {
        return ValidationMessage.ERROR_SYMBOL;
      }
      if (hashtags[i].length === 1) {
        return ValidationMessage.ERROR_MINLENGTH;
      }
      if (hashtags[i].length >= ValidationHashtag.MAX_LENGTH) {
        return ValidationMessage.ERROR_MAXLENGTH;
      }
      if (unique) {
        return ValidationMessage.ERROR_DUBLICATES;
      }
      if (hashtags[i].lastIndexOf(ValidationHashtag.FIRST_SYMBOL) > 0) {
        return ValidationMessage.ERROR_SPACES;
      }
      if (hashtags.length > ValidationHashtag.MAX_TAGS) {
        return ValidationMessage.ERROR_MAXHASHTAGS;
      }
    }
    return '';
  };

  var hashtagInput = document.querySelector(validationSelector.HASHTAGS);

  hashtagInput.addEventListener('input', function (evt) {
    var target = evt.target;
    var parsedHashtags = target.value.split(/\s+/);
    var validation = getValidationHashtags(parsedHashtags);
    evt.target.setCustomValidity(validation);
  });

  var descriptionInput = document.querySelector(validationSelector.DESCRIPTION);

  descriptionInput.setAttribute('maxlength', ValidationDescription.MAX_LENGTH);

})();
