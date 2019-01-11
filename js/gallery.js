'use strict';

/* Модуль формирования галлереи */
/* Зависимости: picture.js, preview.js, util.js, backend.js */

(function () {

  var gallerySelector = {
    PICTURES: '.pictures',
    PICTURE_ITEM: '.picture',
    PICTURE_TEMPLATE: '#picture',
    IMG_FILTERS: '.img-filters',
    IMG_FILTERS_ACTIVE: '.img-filters__button--active',

    PICTURE_IMG: '.picture__img',
    PICTURE_LIKES: '.picture__likes',
    PICTURE_COMMENT: '.picture__comments',
  };

  var galleryClass = {
    PICTURE_IMG: 'picture__img',
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

  var picturesData = {};
  var filteredData = {};

  var filters = document.querySelector(gallerySelector.IMG_FILTERS);
  var pictures = document.querySelector(gallerySelector.PICTURES);
  window.activeFilter = document.querySelector(gallerySelector.IMG_FILTERS_ACTIVE);

  /* -------------------- functions --------------------------- */

  var showFilterBlock = function () {
    var filtersBlock = document.querySelector(gallerySelector.IMG_FILTERS);
    filtersBlock.classList.remove(galleryClass.IMG_FILTERS_INACTIIVE);
  };

  var loadCheck = function (maxCount) {
    var counter = 0;
    var upCounter = function () {
      counter++;
      if (counter === maxCount) {
        showFilterBlock();
      }
    };
    return upCounter;
  };

  var renderPictureList = function (data) {
    filteredData = data;
    var picturesElement = document.querySelector(gallerySelector.PICTURES);
    var picturesTemplate = document.querySelector(gallerySelector.PICTURE_TEMPLATE)
        .content
        .querySelector(gallerySelector.PICTURE_ITEM);
    var elementList = picturesElement.querySelectorAll(gallerySelector.PICTURE_ITEM);

    window.util.removeChildren(picturesElement, elementList);

    var fragment = document.createDocumentFragment();

    data.forEach(function (element, i) {
      var picture = renderPicture(element, picturesTemplate, i);
      fragment.appendChild(picture);
    });

    picturesElement.appendChild(fragment);

    var renderedPictures = picturesElement.querySelectorAll(gallerySelector.PICTURE_IMG);

    var onPictureload = loadCheck(renderedPictures.length);

    renderedPictures.forEach(function (renderedPicture) {
      renderedPicture.addEventListener('load', onPictureload);
    });

  };

  var renderPicture = function (picture, picturesTemplate, id) {
    var pictureElement = picturesTemplate.cloneNode(true);
    var elementLink = pictureElement.querySelector(gallerySelector.PICTURE_IMG);
    var elementLikes = pictureElement.querySelector(gallerySelector.PICTURE_LIKES);
    var elementComment = pictureElement.querySelector(gallerySelector.PICTURE_COMMENT);

    elementLink.src = picture.url;
    elementLikes.textContent = picture.likes;
    elementComment.textContent = picture.comments.length;
    elementLink.setAttribute('data-id', id);

    return pictureElement;
  };

  var mixData = function (data) {
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

  var updateGallery = function (data, filter) {

    switch (filter) {
      case filtersName.NEW:
        var mixingPictures = mixData(data.slice()).slice(0, MAX_NEW_PICTURES);
        renderPictureList(mixingPictures);
        break;
      case filtersName.DISSCUSED:
        var popularPictures = data.slice().
          sort(function (left, right) {
            return right.comments.length - left.comments.length;
          });
        renderPictureList(popularPictures);
        break;
      default:
        renderPictureList(data);
        break;
    }
  };

  var successHandler = function (data) {
    picturesData = data;
    renderPictureList(picturesData);
  };

  var onFilterChange = window.util.debounce(function () {
    var filter = window.activeFilter.getAttribute('id');
    updateGallery(picturesData, filter);
  });

  /* -------------------- actions --------------------------- */

  window.backend.action(successHandler, window.backend.error);

  pictures.addEventListener('click', function (evt) {
    if (evt.target.classList.contains(galleryClass.PICTURE_IMG)) {
      var dataId = evt.target.getAttribute('data-id');
      window.preview.renderPreview(filteredData[dataId]);
    }
  });

  filters.addEventListener('click', function (evt) {
    if (evt.target.className === galleryClass.IMG_FILTERS_BUTTON) {
      window.activeFilter.classList.remove(galleryClass.IMG_FILTERS_ACTIVE);
      window.activeFilter = evt.target;
      window.activeFilter.classList.add(galleryClass.IMG_FILTERS_ACTIVE);
      onFilterChange();
    }
  });

})();
