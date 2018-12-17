'use strict';

/* Модуль формирования галлереи */
/* Зависимости: picture.js, preview.js, util.js */

(function () {

  var gallerySelector = {
    BODY: 'body',
    BIG_CLOSE: '.big-picture__cancel',
    BIG_PICTURE: '.big-picture',

    PICTURE: '.pictures',
    PICTURE_ITEM: '.picture',
    PICTURE_TEMPLATE: '#picture',
  };

  /* ------- create Pictures collections -------- */

  var picturesElement = document.querySelector(gallerySelector.PICTURE);
  var picturesTemplate = document.querySelector(gallerySelector.PICTURE_TEMPLATE)
      .content
      .querySelector(gallerySelector.PICTURE_ITEM);

  var fragment = document.createDocumentFragment();

  for (var j = 0; j < window.data.length; j++) {
    fragment.appendChild(window.picture.renderPictures(window.data[j], picturesTemplate));
  }

  picturesElement.appendChild(fragment);

  /* ------- changes preview picture -------- */

  var picturesList = document.querySelectorAll(gallerySelector.PICTURE_ITEM);

  picturesList.forEach(function (element, i) {
    element.addEventListener('click', function () {
      var currentPictureId = i;
      window.util.openPopup(gallerySelector.BIG_PICTURE, gallerySelector.BODY);
      window.preview.setPreview(currentPictureId, window.data);
    });
    element.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.ENTER_KEYCODE) {
        var currentPictureId = i;
        window.util.openPopup(gallerySelector.BIG_PICTURE, gallerySelector.BODY);
        window.preview.setPreview(currentPictureId, window.data);
      }
    });
  });

  var closePreview = document.querySelector(gallerySelector.BIG_CLOSE);
  closePreview.addEventListener('click', function () {
    window.util.closePopup(gallerySelector.BIG_PICTURE, gallerySelector.BODY);
  });

})();
