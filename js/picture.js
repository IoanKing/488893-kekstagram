'use strict';

/* Модуль открисовки миниатюр */
/* Зависимости: нет */

(function () {

  var pictureSelectors = {
    PICTURE_LINK: '.picture__img',
    PICTURE_LIKES: '.picture__likes',
    PICTURE_COMMENT: '.picture__comments',
  };

  window.picture = {
    renderPictures: function (picture, picturesTemplate) {
      var pictureElement = picturesTemplate.cloneNode(true);
      pictureElement.querySelector(pictureSelectors.PICTURE_LINK).src = picture.url;
      pictureElement.querySelector(pictureSelectors.PICTURE_LIKES).textContent = picture.likes;
      pictureElement.querySelector(pictureSelectors.PICTURE_COMMENT).textContent = picture.comment.length;

      return pictureElement;
    }
  };

})();
