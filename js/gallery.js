'use strict';

/* Модуль формирования галлереи */
/* Зависимости: picture.js, preview.js, util.js, backend.js */

(function () {

  var gallerySelector = {
    PICTURE: '.pictures',
    PICTURE_ITEM: '.picture',
    PICTURE_TEMPLATE: '#picture',
  };

  /* ------- create Pictures collections -------- */
  var successHandler = function (pictures) {
    var picturesElement = document.querySelector(gallerySelector.PICTURE);
    var picturesTemplate = document.querySelector(gallerySelector.PICTURE_TEMPLATE)
        .content
        .querySelector(gallerySelector.PICTURE_ITEM);

    var fragment = document.createDocumentFragment();

    for (var j = 0; j < pictures.length; j++) {
      fragment.appendChild(window.picture.renderPictures(pictures[j], picturesTemplate, j));
    }

    picturesElement.appendChild(fragment);
    window.pictures = pictures;
  };

  window.backend.load(successHandler, window.backend.error);

  /* ------- open Preview -------- */

  var picturesList = document.querySelector(gallerySelector.PICTURE);

  picturesList.addEventListener('click', window.preview.onOpenPreview);

  picturesList.addEventListener('keydown', window.preview.onKeydownPreview);

})();
