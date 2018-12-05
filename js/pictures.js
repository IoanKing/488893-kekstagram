
'use strict';

/* --------------- CONSTANS -----------------*/
var PICTURES_COUNT = 25;
var COMMENTS_AVATAR_COUNT = 6;
var COMMENTS_MAX_COUNT = 2;
var COMMENTS_MIN_COUNT = 1;
var MAX_LIKE_VALUE = 200;
var SCALE_MAX = 100;
var SCALE_MIN = 25;
var SCALE_DEFAULT = 55;
var SCALE_STEP = 25;

var FILTER_DEFAULT = 20;

var Selectors = {
  PICTURE: '.pictures',
  PICTURE_TAMPLATE: '#picture',
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
  HASHTAGS_FOCUS: '.text__hashtags:focus',
  DESCRIPTION_FOCUS: '.text__description:focus',
  COMMENT_FOCUS: '.social__footer-text:focus',

  SCALE_SMALLER: '.scale__control--smaller',
  SCALE_BIGGER: '.scale__control--bigger',
  SCALE_VALUE: '.scale__control--value',
  SLIDER: '.img-upload__effect-level',
  EFFECT_LEVEL: '.effect-level',
};

var Classes = {
  HIDDEN_CLASS: 'hidden',
  MODAL_OPEN_CLASS: 'modal-open',
  EFFECT_PREVIEW: 'effects__preview',
};

var Effects = {
  CHROME: {
    name: 'chrome',
    filter: 'grayscale',
    min: 0,
    max: 1,
    unit: '',
  },
  SEPIA: {
    name: 'sepia',
    filter: 'sepia',
    min: 0,
    max: 1,
    unit: '',
  },
  MARVIN: {
    name: 'marvin',
    filter: 'invert',
    min: 0,
    max: 100,
    unit: '%',
  },
  FOBOS: {
    name: 'fobos',
    filter: 'blur',
    min: 1,
    max: 3,
    unit: 'px',
  },
  HEAT: {
    name: 'heat',
    filter: 'brightness',
    min: 1,
    max: 3,
    unit: '',
  },
};

var Shortcuts = {
  ESC_KEYCODE: 27,
  ENTER_KEYCODE: 13,
};

var PICTURE_PATCH = 'photos/';
var PICTURE_FORMAT = '.jpg';

var COMMENT_AVATAR_PATCH = 'img/avatar-';
var COMMENT_AVATAR_FORMAT = '.svg';

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
    url: PICTURE_PATCH + pictureUrl + PICTURE_FORMAT,
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
  commentTemplate.querySelector(Selectors.SOCIAL_PICTURE).src = COMMENT_AVATAR_PATCH + getRandomInt(1, COMMENTS_AVATAR_COUNT) + COMMENT_AVATAR_FORMAT;
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

var onFocusInput = function (element) {
  return document.querySelector(element);
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
    if (evt.keyCode === Shortcuts.ESC_KEYCODE && !onFocusInput(Selectors.HASHTAGS_FOCUS) && !onFocusInput(Selectors.DESCRIPTION_FOCUS) && !onFocusInput(Selectors.COMMENT_FOCUS)) {
      closePopup(element, additionalElement);
    }
  });
};

var removingClass = function (element) {
  var classList = imagePreviews.className.split(' ').join(', ');
  if (classList) {
    element.classList.remove(classList);
  }
};

var getValueElement = function (element) {
  var scaleValue = element.getAttribute('value');
  var scaleLastSimbol = scaleValue.substr(scaleValue.length - 1, scaleValue.length);
  if (typeof scaleLastSimbol !== 'number') {
    return parseInt(scaleValue.substr(0, scaleValue.length - 1), 10);
  } else {
    return parseInt(scaleValue, 10);
  }
};

var setScale = function (element, value, scale) {
  value.setAttribute('value', scale.toString() + '%');
  element.style.transform = 'scale(' + scale / 100 + ')';
};

var changeEffectLevel = function () {
  console.log('Навели!');
  var beginCoord = FILTER_DEFAULT;
  var effectLevel = document.querySelector(Selectors.EFFECT_LEVEL);
  var element = document.querySelector(Selectors.PREVIEW);
  var prewievElement = document.querySelector(Selectors.EFFECT_PREVIEW);
  var effect = prewievElement.getAttribute('value');
  var setValue = beginCoord;
  switch (effect) {
    case Classes.EFFECT_PREVIEW + '--' + Effects.CHROME.name:
      setValue = beginCoord;
      element.style.filter = Effects.CHROME.effect + '(' + setValue + Effects.CHROME.unit + ')';
      effectLevel.setAttribute('value', setValue);
      break;
    case Classes.EFFECT_PREVIEW + '--' + Effects.SEPIA.name:
      setValue = beginCoord;
      element.style.filter = Effects.SEPIA.effect + '(' + setValue + Effects.SEPIA.unit + ')';
      effectLevel.setAttribute('value', setValue);
      break;
    case Classes.EFFECT_PREVIEW + '--' + Effects.MARVIN.name:
      setValue = beginCoord;
      element.style.filter = Effects.MARVIN.effect + '(' + setValue + Effects.MARVIN.unit + ')';
      effectLevel.setAttribute('value', setValue);
      break;
    case Classes.EFFECT_PREVIEW + '--' + Effects.FOBOS.name:
      setValue = beginCoord;
      element.style.filter = Effects.FOBOS.effect + '(' + setValue + Effects.FOBOS.unit + ')';
      effectLevel.setAttribute('value', setValue);
      break;
    case Classes.EFFECT_PREVIEW + '--' + Effects.HEAT.name:
      setValue = beginCoord;
      element.style.filter = Effects.HEAT.effect + '(' + setValue + Effects.HEAT.unit + ')';
      effectLevel.setAttribute('value', setValue);
      break;
    default:
      element.style.filter = '';
      effectLevel.setAttribute('value', FILTER_DEFAULT);
  }
};

/* ------- create Pictures collections -------- */

var pictures = fillPicturesCollection(comments, descriptions);
var picturesElement = document.querySelector(Selectors.PICTURE);
var picturesTemplate = document.querySelector(Selectors.PICTURE_TAMPLATE)
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
var scaleImgValue = document.querySelector(Selectors.SCALE_VALUE);
var slider = document.querySelector(Selectors.SLIDER);

imageEffects.forEach(function (element) {
  element.addEventListener('click', function () {
    var effect = element.getAttribute('value');
    removingClass(imagePreviews);
    if (effect !== 'none') {
      imagePreviews.classList.add(Classes.EFFECT_PREVIEW + '--' + effect);
      slider.classList.remove(Classes.HIDDEN_CLASS);
    } else {
      slider.classList.add(Classes.HIDDEN_CLASS);
    }
  });
});

slider.addEventListener('mouseup', changeEffectLevel);

/* ------- CHANGE SCALE -------- */

var buttonScaleSmaller = document.querySelector(Selectors.SCALE_SMALLER);
var buttonScaleBigger = document.querySelector(Selectors.SCALE_BIGGER);

buttonScaleSmaller.addEventListener('click', function () {
  var changedValue = getValueElement(scaleImgValue) - SCALE_STEP;
  if (changedValue >= SCALE_MIN) {
    setScale(imagePreviews, scaleImgValue, changedValue);
  } else {
    setScale(imagePreviews, scaleImgValue, SCALE_MIN);
  }
});

buttonScaleBigger.addEventListener('click', function () {
  var changedValue = getValueElement(scaleImgValue) + SCALE_STEP;
  if (changedValue <= SCALE_MAX) {
    setScale(imagePreviews, scaleImgValue, changedValue);
  } else {
    setScale(imagePreviews, scaleImgValue, SCALE_MAX);
  }
});
