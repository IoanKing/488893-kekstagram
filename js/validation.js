'use strict';

/* Модуль валидации формы */
/* Зависимости: нет */

(function () {

  var validationHashtag = {
    FIRST_SYMBOL: '#',
    MAX_LENGTH: 21,
    MAX_TAGS: 5,
  };

  var MAX_LENGTH = 140;
  var ERROR_OUTLINE = '3px solid red';

  var ValidationMessage = {
    ERROR_SYMBOL: 'Хеш теги должны начинатся с символа ' + validationHashtag.FIRST_SYMBOL + '.',
    ERROR_MINLENGTH: 'Хеш-тег не может состоять только из одного символа ' + validationHashtag.FIRST_SYMBOL + '.',
    ERROR_MAXLENGTH: 'Максимальная длина одного хэш-тега ' + validationHashtag.MAX_LENGTH + ' символов, включая решётку.',
    ERROR_DUBLICATES: 'Один и тот же хэш-тег не может быть использован дважды.',
    ERROR_SPACES: 'Хэш-теги разделяются пробелами.',
    ERROR_MAXHASHTAGS: 'Нельзя указать больше ' + validationHashtag.MAX_TAGS + ' хэш-тегов.',
  };

  var checkUnique = function (collection) {
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

  var validateHashtags = function (hashtags) {
    var isDouble = checkUnique(hashtags);
    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags[i][0] !== validationHashtag.FIRST_SYMBOL) {
        return ValidationMessage.ERROR_SYMBOL;
      }
      if (hashtags[i].length === 1) {
        return ValidationMessage.ERROR_MINLENGTH;
      }
      if (hashtags[i].length >= validationHashtag.MAX_LENGTH) {
        return ValidationMessage.ERROR_MAXLENGTH;
      }
      if (isDouble) {
        return ValidationMessage.ERROR_DUBLICATES;
      }
      if (hashtags[i].lastIndexOf(validationHashtag.FIRST_SYMBOL) > 0) {
        return ValidationMessage.ERROR_SPACES;
      }
      if (hashtags.length > validationHashtag.MAX_TAGS) {
        return ValidationMessage.ERROR_MAXHASHTAGS;
      }
    }
    return '';
  };

  window.validation = {
    MAX_LENGTH: MAX_LENGTH,
    ERROR_OUTLINE: ERROR_OUTLINE,
    validateHashtags: validateHashtags
  };

})();
