
'use strict';

/* --------------- CONSTANS -----------------*/
var PICTURES_COUNT = 25;
var COMMENTS_AVATAR_COUNT = 6;
var COMMENTS_MAX_COUNT = 2;
var COMMENTS_MIN_COUNT = 1;
var MAX_LIKE_VALUE = 200;

var Selectors = {
  PICTURE_SELECTOR: '.pictures',
  PICTURE_TAMPLATE_SELECTOR: '#picture',
  PICTURE_ITEM_SELECTOR: '.picture',
  PICTURE_LINK_SELECTOR: '.picture__img',
  PICTURE_LIKES_SELECTOR: '.picture__likes',
  PICTURE_COMMENT_SELECTOR: '.picture__comments',
  BIG_PICTURE_SELECTOR: '.big-picture',
  BIG_IMG_SELECTOR: '.big-picture__img > img',
  BODY_SELECTOR: 'body',
  LIKES_COUNT_SELECTOR: '.likes-count',
  SOCIAL_CAPTION_SELECTOR: '.social__caption',
  SOCIAL_COMMENTS_SELECTOR: '.social__comments',
  SOCIAL_COMMENT_SELECTOR: '.social__comment',
  SOCIAL_PICTURE_SELECTOR: '.social__picture',
  SOCIAL_TEXT_SELECTOR: '.social__text',
};

var Classes = {
  HIDDEN_CLASS: 'hidden',
  MODAL_OPEN_CLASS: 'modal-open',
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

var setPictureComments = function (urlPicture, commentToPicture, descriptionToPicture) {
  var randomCountComment = getRandomInt(0, COMMENTS_MAX_COUNT) + COMMENTS_MIN_COUNT;
  var commentsToPicture = [];
  for (var i = 0; i < randomCountComment; i++) {
    commentsToPicture.push(getRandomElement(commentToPicture));
  }
  return {
    url: PICTURE_PATCH + urlPicture + PICTURE_FORMAT,
    likes: getRandomInt(1, MAX_LIKE_VALUE),
    comment: commentsToPicture,
    description: getRandomElement(descriptionToPicture)
  };
};

var fillPicturesCollection = function (commentToPicture, descriptionToPicture) {
  var picturesCollections = [];
  for (var i = 1; i <= PICTURES_COUNT; i++) {
    picturesCollections.push(setPictureComments(i, commentToPicture, descriptionToPicture));
  }
  return picturesCollections;
};

var renderPictures = function (picture, picturesTemplate) {
  var pictureElement = picturesTemplate.cloneNode(true);
  pictureElement.querySelector(Selectors.PICTURE_LINK_SELECTOR).src = picture.url;
  pictureElement.querySelector(Selectors.PICTURE_LIKES_SELECTOR).textContent = picture.likes;
  pictureElement.querySelector(Selectors.PICTURE_COMMENT_SELECTOR).textContent = picture.comment.length;

  return pictureElement;
};

var createComment = function (commentsArr, template) {
  var commentTemplate = template.cloneNode(true);
  commentTemplate.querySelector(Selectors.SOCIAL_PICTURE_SELECTOR).src = COMMENT_AVATAR_PATCH + getRandomInt(1, COMMENTS_AVATAR_COUNT) + COMMENT_AVATAR_FORMAT;
  commentTemplate.querySelector(Selectors.SOCIAL_TEXT_SELECTOR).textContent = commentsArr;
  return commentTemplate;
};

var setBigPicture = function (current, block, picturesObj) {
  block.querySelector(Selectors.BIG_IMG_SELECTOR).src = picturesObj[current].url;
  block.querySelector(Selectors.LIKES_COUNT_SELECTOR).textContent = picturesObj[current].likes;
  block.querySelector(Selectors.SOCIAL_CAPTION_SELECTOR).textContent = picturesObj[current].description;
};

var removeChildren = function (parent, element) {
  for (var i = 0; i < element.length; i++) {
    parent.removeChild(element[i]);
  }
};

/* ------- create Pictures collections -------- */

var pictures = fillPicturesCollection(comments, descriptions);
var picturesElement = document.querySelector(Selectors.PICTURE_SELECTOR);
var picturesTemplate = document.querySelector(Selectors.PICTURE_TAMPLATE_SELECTOR)
    .content
    .querySelector(Selectors.PICTURE_ITEM_SELECTOR);

var fragment = document.createDocumentFragment();
for (var j = 0; j < pictures.length; j++) {
  fragment.appendChild(renderPictures(pictures[j], picturesTemplate));
}
picturesElement.appendChild(fragment);

/* ------- change Big Picture -------- */

var pictureBlock = document.querySelector(Selectors.BIG_PICTURE_SELECTOR);
var bodyBlock = document.querySelector(Selectors.BODY_SELECTOR);

var currentPictureId = 0;

pictureBlock.classList.remove(Classes.HIDDEN_CLASS);
bodyBlock.classList.add(Classes.MODAL_OPEN_CLASS);

setBigPicture(currentPictureId, pictureBlock, pictures);

var socialComments = pictureBlock.querySelector(Selectors.SOCIAL_COMMENTS_SELECTOR);
var socialCommentList = socialComments.querySelectorAll(Selectors.SOCIAL_COMMENT_SELECTOR);
var socialCommentTemplate = socialCommentList[0].cloneNode(true);

removeChildren(socialComments, socialCommentList);

var fragmentComments = document.createDocumentFragment();
for (var k = 0; k < pictures[currentPictureId].comment.length; k++) {
  var newComment = createComment(pictures[currentPictureId].comment[k], socialCommentTemplate);
  fragmentComments.appendChild(newComment);
}
socialComments.appendChild(fragmentComments);
