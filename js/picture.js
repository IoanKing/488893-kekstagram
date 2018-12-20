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
    renderPictures: function (picture, picturesTemplate, id) {
      var pictureElement = picturesTemplate.cloneNode(true);
      var elementLink = pictureElement.querySelector(pictureSelectors.PICTURE_LINK);
      var elementLikes = pictureElement.querySelector(pictureSelectors.PICTURE_LIKES);
      var elementComment = pictureElement.querySelector(pictureSelectors.PICTURE_COMMENT);

      elementLink.src = picture.url;
      elementLink.setAttribute('data-id', id);
      elementLikes.textContent = picture.likes;
      elementComment.textContent = picture.comments.length;

      return pictureElement;
    }
  };

})();
