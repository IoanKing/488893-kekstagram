'use strict';

/* Модуль формирования галлереи */
/* Зависимости: picture.js, preview.js, util.js, backend.js */

(function () {

  var gallerySelector = {
    PICTURE: '.pictures',
    PICTURE_ITEM: '.picture',
    PICTURE_TEMPLATE: '#picture',
    IMG_FILTERS: '.img-filters',
    IMG_FILTERS_ACTIVE: '.img-filters__button--active'
  };

  var galleryClass = {
    IMG_FILTERS_BUTTON: 'img-filters__button',
    IMG_FILTERS_ACTIVE: 'img-filters__button--active',
    IMG_FILTERS_INACTIIVE: 'img-filters--inactive'
  };

  var filtersName = {
    POPULAR: 'filter-popular',
    NEW: 'filter-new',
    DISSCUSED: 'filter-discussed'
  };

  var MAX_NEW_PICTURES = 10;

  var pictureList = [];

  /* ------- create Pictures collections -------- */
  var filters = document.querySelector(gallerySelector.IMG_FILTERS);
  filters.classList.remove(galleryClass.IMG_FILTERS_INACTIIVE);

  var picturesElement = document.querySelector(gallerySelector.PICTURE);
  var picturesTemplate = document.querySelector(gallerySelector.PICTURE_TEMPLATE)
      .content
      .querySelector(gallerySelector.PICTURE_ITEM);

  var render = function (data) {
    var elementList = picturesElement.querySelectorAll(gallerySelector.PICTURE_ITEM);
    window.util.removeChildren(picturesElement, elementList);

    var fragment = document.createDocumentFragment();

    for (var j = 0; j < data.length; j++) {
      fragment.appendChild(window.picture.renderPictures(data[j], picturesTemplate, j));
    }

    picturesElement.appendChild(fragment);
  };

  var mixingData = function (data) {
    var j;
    var temp;
    for (var i = data.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = data[j];
      data[j] = data[i];
      data[i] = temp;
    }
    return data;
  };

  var updateGallery = function () {

    var filter = window.activeFilter.getAttribute('id');

    switch (filter) {
      case filtersName.POPULAR:
        render(pictureList);
        window.gallery.elementList = pictureList;
        break;
      case filtersName.NEW:
        var mixingPictures = mixingData(pictureList.slice()).slice(0, MAX_NEW_PICTURES);
        render(mixingPictures);
        window.gallery.elementList = mixingPictures;
        break;
      case filtersName.DISSCUSED:
        var popularPictures = pictureList.slice().
          sort(function (left, right) {
            var rankDiff = right.comments.length - left.comments.length;
            if (rankDiff > 0) {
              rankDiff = pictureList.indexOf(left) - pictureList.indexOf(right);
            }
            return rankDiff;
          });
        render(popularPictures);
        window.gallery.elementList = popularPictures;
        break;
      default:
        render(pictureList);
        break;
    }
  };

  var successHandler = function (data) {
    pictureList = data;
    window.gallery.elementList = pictureList;
    updateGallery();
  };

  window.backend.action(successHandler, window.backend.error);

  var onFilterChange = window.debounce(function () {
    updateGallery();
  });

  window.activeFilter = document.querySelector(gallerySelector.IMG_FILTERS_ACTIVE);

  filters.addEventListener('click', function (evt) {
    if (evt.target.className === galleryClass.IMG_FILTERS_BUTTON) {
      window.activeFilter.classList.remove(galleryClass.IMG_FILTERS_ACTIVE);
      window.activeFilter = evt.target;
      window.activeFilter.classList.add(galleryClass.IMG_FILTERS_ACTIVE);
      onFilterChange();
    }
  });

  /* ------- open Preview -------- */

  var previewList = document.querySelector(gallerySelector.PICTURE);

  previewList.addEventListener('click', window.preview.onOpenPreview);

  previewList.addEventListener('keydown', window.preview.onKeydownPreview);

  window.gallery = {
    elementList: []
  };

})();
