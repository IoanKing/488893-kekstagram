'use strict';

/* Модуль создания данных для отрисовки */
/* Зависимости: нет */

(function () {

  var PICTURES_COUNT = 25;
  var COMMENTS_AVATAR_COUNT = 6;
  var COMMENTS_MAX_COUNT = 2;
  var COMMENTS_MIN_COUNT = 1;
  var MAX_LIKE_VALUE = 200;

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

  /* функции */

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
      var commentData = {
        text: getRandomElement(pictureComments),
        avatar: images.COMMENT_AVATAR.patch + getRandomInt(1, COMMENTS_AVATAR_COUNT) + images.COMMENT_AVATAR.format
      };
      commentsToPicture.push(commentData);
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

  window.data = fillPicturesCollection(comments, descriptions);

})();
