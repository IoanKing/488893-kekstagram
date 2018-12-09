
'use strict';

/* --------------- CONSTANS -----------------*/
var PICTURES_COUNT = 25;
var COMMENTS_AVATAR_COUNT = 6;
var COMMENTS_MAX_COUNT = 2;
var COMMENTS_MIN_COUNT = 1;
var MAX_LIKE_VALUE = 200;

var ScaleSettings = {
  SCALE_MAX: 100,
  SCALE_MIN: 25,
  SCALE_STEP: 25,
};

var FILTER_DEFAULT = 100;

var Selectors = {
  PICTURE: '.pictures',
  PICTURE_TEMPLATE: '#picture',
  PICTURE_ITEM: '.picture',
  PICTURE_LINK: '.picture__img',
  PICTURE_LIKES: '.picture__likes',
  PICTURE_COMMENT: '.picture__comments',
  BIG_PICTURE: '.big-picture',
  BIG_IMG: '.big-picture__img > img',
  BIG_CLOSE: '.big-picture__cancel',
  EDITOR_CLOSE: '.img-upload__cancel',
  CLOSE: '.cancel',
  BODY: 'body',
  LIKES_COUNT: '.likes-count',
  SOCIAL_CAPTION: '.social__caption',
  SOCIAL_COMMENTS: '.social__comments',
  SOCIAL_COMMENT: '.social__comment',
  SOCIAL_PICTURE: '.social__picture',
  SOCIAL_TEXT: '.social__text',
  PREVIEW: '.img-upload__preview',
  IMAGE_PREVIEW: '.img-upload__preview > img',
  IMAGE_FILTER: '.effects__radio',

  UPLOAD_FILE: '#upload-file',
  EDITOR_FORM: '.img-upload__overlay',

  EDITOR_PIN: '.effect-level__pin',

  SCALE_SMALLER: '.scale__control--smaller',
  SCALE_BIGGER: '.scale__control--bigger',
  SCALE_VALUE: '.scale__control--value',
  SLIDER: '.img-upload__effect-level',
  EFFECT_LEVEL: '.effect-level__value',
};

var Classes = {
  HIDDEN_CLASS: 'hidden',
  MODAL_OPEN_CLASS: 'modal-open',
  EFFECT_PREVIEW: 'effects__preview',
  HASHTAGS_FOCUS: 'text__hashtags',
  DESCRIPTION_FOCUS: 'text__description',
  COMMENT_FOCUS: 'social__footer-text',
};

var Effects = {
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    unit: '',
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    unit: '',
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    unit: '%',
  },
  phobos: {
    filter: 'blur',
    min: 1,
    max: 3,
    unit: 'px',
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    unit: '',
  },
  none: {
    filter: '',
    min: 1,
    max: 1,
    unit: '',
  },
};

var EFFECTS_LIST = Object.keys(Effects);

var Shortcuts = {
  ESC_KEYCODE: 27,
  ENTER_KEYCODE: 13,
};

var images = {
  PICTURE: {
    patch: 'photos/',
    format: '.jpg'
  },
  COMMENT_AVATAR: {
    patch: 'img/avatar-',
    format: '.svg'
  }
};

/* --------------- ARRAYS -----------------*/

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!',
];

/* --------------- FUNCTIONS -----------------*/

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getRandomElement = function (collection) {
  return collection[getRandomInt(0, collection.length)];
};

var setPictureComments = function (pictureUrl, pictureComments, descriptionToPicture) {
  var randomCountComment = getRandomInt(0, COMMENTS_MAX_COUNT) + COMMENTS_MIN_COUNT;
  var commentsToPicture = [];
  for (var i = 0; i < randomCountComment; i++) {
    commentsToPicture.push(getRandomElement(pictureComments));
  }
  return {
    url: images.PICTURE.patch + pictureUrl + images.PICTURE.format,
    likes: getRandomInt(1, MAX_LIKE_VALUE),
    comment: commentsToPicture,
    description: getRandomElement(descriptionToPicture)
  };
};

var fillPicturesCollection = function (pictureComments, pictureDescription) {
  var picturesCollections = [];
  for (var i = 1; i <= PICTURES_COUNT; i++) {
    picturesCollections.push(setPictureComments(i, pictureComments, pictureDescription));
  }
  return picturesCollections;
};

var renderPictures = function (picture, picturesTemplate) {
  var pictureElement = picturesTemplate.cloneNode(true);
  pictureElement.querySelector(Selectors.PICTURE_LINK).src = picture.url;
  pictureElement.querySelector(Selectors.PICTURE_LIKES).textContent = picture.likes;
  pictureElement.querySelector(Selectors.PICTURE_COMMENT).textContent = picture.comment.length;

  return pictureElement;
};

var createComment = function (commentsArr, template) {
  var commentTemplate = template.cloneNode(true);
  commentTemplate.querySelector(Selectors.SOCIAL_PICTURE).src = images.COMMENT_AVATAR.patch + getRandomInt(1, COMMENTS_AVATAR_COUNT) + images.COMMENT_AVATAR.format;
  commentTemplate.querySelector(Selectors.SOCIAL_TEXT).textContent = commentsArr;
  return commentTemplate;
};

var setBigPicture = function (current, block, picture) {
  block.querySelector(Selectors.BIG_IMG).src = picture[current].url;
  block.querySelector(Selectors.LIKES_COUNT).textContent = picture[current].likes;
  block.querySelector(Selectors.SOCIAL_CAPTION).textContent = picture[current].description;

  var socialComments = block.querySelector(Selectors.SOCIAL_COMMENTS);
  var socialCommentList = socialComments.querySelectorAll(Selectors.SOCIAL_COMMENT);
  var socialCommentTemplate = socialCommentList[0].cloneNode(true);

  removeChildren(socialComments, socialCommentList);

  var fragmentComments = document.createDocumentFragment();
  for (var k = 0; k < pictures[current].comment.length; k++) {
    var newComment = createComment(pictures[current].comment[k], socialCommentTemplate);
    fragmentComments.appendChild(newComment);
  }
  socialComments.appendChild(fragmentComments);
};

var removeChildren = function (parent, element) {
  for (var i = 0; i < element.length; i++) {
    parent.removeChild(element[i]);
  }
};

var closePopup = function (element, additionalElement) {
  var closureElement = document.querySelector(element);
  closureElement.classList.add(Classes.HIDDEN_CLASS);
  if (additionalElement) {
    var closureAdditionalForm = document.querySelector(additionalElement);
    closureAdditionalForm.classList.remove(Classes.MODAL_OPEN_CLASS);
  }
};

var openPopup = function (element, additionalElement) {
  var openingElement = document.querySelector(element);
  openingElement.classList.remove(Classes.HIDDEN_CLASS);
  if (additionalElement) {
    var openingAdditionalForm = document.querySelector(additionalElement);
    openingAdditionalForm.classList.add(Classes.MODAL_OPEN_CLASS);
  }
  document.addEventListener('keydown', function (evt) {
    var curentActiveElement = document.activeElement;
    var hasNoFocus = (curentActiveElement.classList.contains(Classes.HASHTAGS_FOCUS) || curentActiveElement.classList.contains(Classes.DESCRIPTION_FOCUS) || curentActiveElement.classList.contains(Classes.COMMENT_FOCUS)) ? false : true;
    if (evt.keyCode === Shortcuts.ESC_KEYCODE && hasNoFocus) {
      closePopup(element, additionalElement);
    }
  });
};

var setScale = function (element, valueAttribute, modificator) {
  /* modificator: Increase = 1, decrease = -1, nothing = 0  */
  var scaleValue = parseInt(valueAttribute.getAttribute('value'), 10);
  var changedValue = Math.max(ScaleSettings.SCALE_MIN, Math.min(scaleValue + ScaleSettings.SCALE_STEP * modificator, ScaleSettings.SCALE_MAX));

  valueAttribute.setAttribute('value', changedValue.toString() + '%');
  element.style.transform = 'scale(' + changedValue / 100 + ')';
};

var getProportion = function (min, max, modificator) {
  return (modificator) ? ((max - min) / 100) : (100 / (max - min));
};

var getFilter = function (filter, value, unit) {
  return (filter) ? filter + '(' + value + unit + ')' : '';
};

var setEffect = function (element, effect, value) {
  var effectLevel = document.querySelector(Selectors.EFFECT_LEVEL);
  var filter = Effects[effect];
  var proportion = getProportion(filter.min, filter.max, 1);
  var proportionUndo = getProportion(filter.min, filter.max, 0);

  var valueFilter = Math.max(filter.min, Math.min(proportion * value + filter.min, filter.max));

  element.style.filter = getFilter(filter.filter, valueFilter, filter.unit);
  effectLevel.value = Math.round((valueFilter - filter.min) * proportionUndo);
};

/* Функция будет изменять фильтр при движении мышки */
var setEffectSlider = function () {
  var imagePreviews = document.querySelector(Selectors.IMAGE_PREVIEW);

  var elementEffect = imagePreviews.getAttribute('class');
  var effect = elementEffect.substring(elementEffect.lastIndexOf('--') + 2, elementEffect.length);

  /* значение step будет измеряться функцией расчета разницы координат */
  var newEffectLevel = 20;
  setEffect(imagePreviews, effect, newEffectLevel);
};

var setClassEffect = function (element, effect) {
  for (var i = 0; i < EFFECTS_LIST.length; i++) {
    element.classList.remove(Classes.EFFECT_PREVIEW + '--' + EFFECTS_LIST[i]);
    if (effect === EFFECTS_LIST[i]) {
      element.classList.add(Classes.EFFECT_PREVIEW + '--' + effect);
    }
  }
};

/* ------- create Pictures collections -------- */

var pictures = fillPicturesCollection(comments, descriptions);
var picturesElement = document.querySelector(Selectors.PICTURE);
var picturesTemplate = document.querySelector(Selectors.PICTURE_TEMPLATE)
    .content
    .querySelector(Selectors.PICTURE_ITEM);

var fragment = document.createDocumentFragment();
for (var j = 0; j < pictures.length; j++) {
  fragment.appendChild(renderPictures(pictures[j], picturesTemplate));
}
picturesElement.appendChild(fragment);

/* ------- change Big Picture -------- */

var picturesList = document.querySelectorAll(Selectors.PICTURE_ITEM);
var pictureBlock = document.querySelector(Selectors.BIG_PICTURE);

picturesList.forEach(function (element, i) {
  element.addEventListener('click', function () {
    var currentPictureId = i;
    openPopup(Selectors.BIG_PICTURE, Selectors.BODY);
    setBigPicture(currentPictureId, pictureBlock, pictures);
  });
  element.addEventListener('keydown', function (evt) {
    if (evt.keyCode === Shortcuts.ENTER_KEYCODE) {
      var currentPictureId = i;
      openPopup(Selectors.BIG_PICTURE, Selectors.BODY);
      setBigPicture(currentPictureId, pictureBlock, pictures);
    }
  });
});

/* ------- OPEN EDITOR FORM -------- */

var openEditor = document.querySelector(Selectors.UPLOAD_FILE);
openEditor.addEventListener('change', function () {
  openPopup(Selectors.EDITOR_FORM, Selectors.EDITOR_FORM);

  var closeEditor = document.querySelector(Selectors.EDITOR_CLOSE);
  closeEditor.addEventListener('click', function () {
    closePopup(Selectors.EDITOR_FORM, Selectors.EDITOR_FORM);
    openEditor.value = '';
  });
});

var closeBigPicture = document.querySelector(Selectors.BIG_CLOSE);
closeBigPicture.addEventListener('click', function () {
  closePopup(Selectors.BIG_PICTURE, Selectors.BODY);
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
    if (effect !== EFFECTS_LIST[EFFECTS_LIST.length - 1]) {
      slider.classList.remove(Classes.HIDDEN_CLASS);
    } else {
      slider.classList.add(Classes.HIDDEN_CLASS);
    }
  });
});

slider.addEventListener('mouseup', setEffectSlider);

/* ------- CHANGE SCALE -------- */

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
