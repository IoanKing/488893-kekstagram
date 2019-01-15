'use strict';

/* Модуль формирования галлереи */
/* Зависимости: constants.js, preview.js, util.js, backend.js */

(function () {

  var MAX_NEW_PICTURES = 10;

  var FilterName = {
    POPULAR: 'filter-popular',
    NEW: 'filter-new',
    DISSCUSED: 'filter-discussed'
  };

  var pictures = [];
  var filteredPictures = [];

  var filter = document.querySelector(window.ElementSelector.IMG_FILTERS);
  var picture = document.querySelector(window.ElementSelector.PICTURES);
  var activeFilter = document.querySelector(window.ElementSelector.IMG_FILTERS_ACTIVE);

  /* -------------------- functions --------------------------- */

  var showFilterBlock = function () {
    var filtersBlock = document.querySelector(window.ElementSelector.IMG_FILTERS);
    filtersBlock.classList.remove(window.ElementClass.IMG_FILTERS_INACTIIVE);
  };

  var loadCompleteAction = function (maxCount) {
    var counter = 0;
    var upCounter = function () {
      counter++;
      if (counter === maxCount) {
        showFilterBlock();
      }
    };
    return upCounter;
  };

  var renderPictureList = function (collections) {
    filteredPictures = collections.slice();
    var picturesElement = document.querySelector(window.ElementSelector.PICTURES);
    var template = document.querySelector(window.ElementSelector.PICTURE_TEMPLATE)
        .content
        .querySelector(window.ElementSelector.PICTURE_ITEM);
    var elements = picturesElement.querySelectorAll(window.ElementSelector.PICTURE_ITEM);

    window.util.removeChildren(picturesElement, elements);

    var fragment = document.createDocumentFragment();

    collections.forEach(function (element, i) {
      var renderedElement = renderPicture(element, template, i);
      fragment.appendChild(renderedElement);
    });

    picturesElement.appendChild(fragment);

    var renderedPictures = picturesElement.querySelectorAll(window.ElementSelector.PICTURE_IMG);

    var onPictureload = loadCompleteAction(renderedPictures.length);

    renderedPictures.forEach(function (renderedPicture) {
      renderedPicture.addEventListener('load', onPictureload);
    });

  };

  var renderPicture = function (data, template, id) {
    var pictureElement = template.cloneNode(true);
    var elementLink = pictureElement.querySelector(window.ElementSelector.PICTURE_IMG);
    var elementLikes = pictureElement.querySelector(window.ElementSelector.PICTURE_LIKES);
    var elementComment = pictureElement.querySelector(window.ElementSelector.PICTURE_COMMENT);

    elementLink.src = data.url;
    elementLikes.textContent = data.likes;
    elementComment.textContent = data.comments.length;
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

  var updateGallery = function (data, filterName) {

    switch (filterName) {
      case FilterName.NEW:
        var mixingData = mixData(data.slice()).slice(0, MAX_NEW_PICTURES);
        renderPictureList(mixingData);
        break;
      case FilterName.DISSCUSED:
        var sortData = data.slice().
          sort(function (left, right) {
            return right.comments.length - left.comments.length;
          });
        renderPictureList(sortData);
        break;
      default:
        renderPictureList(data);
        break;
    }
  };

  var onSuccessLoadData = function (data) {
    pictures = data.slice();
    filteredPictures = pictures;
    renderPictureList(pictures);
  };

  var onFilterChange = window.util.debounce(function () {
    var currentFilter = activeFilter.getAttribute('id');
    updateGallery(pictures, currentFilter);
  });

  /* -------------------- actions --------------------------- */

  window.backend.onLoadData(onSuccessLoadData, window.backend.onConnectionError);

  picture.addEventListener('click', function (evt) {
    if (evt.target.classList.contains(window.ElementClass.PICTURE_IMG)) {
      var dataId = evt.target.getAttribute('data-id');
      window.preview.show(filteredPictures[dataId]);
    }
  });

  document.addEventListener('keydown', function (evt) {
    var focusElement = document.activeElement;
    if (evt.keyCode === window.util.ENTER_KEYCODE && focusElement.classList.contains(window.ElementClass.PICTURE)) {
      var imageElement = focusElement.querySelector(window.ElementSelector.PICTURE_IMG);
      var dataId = imageElement.getAttribute('data-id');
      window.preview.show(filteredPictures[dataId]);
    }
  });

  filter.addEventListener('click', function (evt) {
    if (evt.target.className === window.ElementClass.IMG_FILTERS_BUTTON) {
      activeFilter.classList.remove(window.ElementClass.IMG_FILTERS_ACTIVE);
      activeFilter = evt.target;
      activeFilter.classList.add(window.ElementClass.IMG_FILTERS_ACTIVE);
      onFilterChange();
    }
  });

})();
