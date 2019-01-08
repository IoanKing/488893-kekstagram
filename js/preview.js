'use strict';

/* Модуль отрисовки Большой картинки Preview */
/* Зависимости: data.js, util.js */

(function () {

  var COMMENT_VIEW_MAX = 5;

  var previewClass = {
    HIDDEN: 'hidden',
    VISUALLY_HIDDEN: 'visually-hidden',
    CLICK_TRAGET: 'picture__img',
    LOADER: 'comments-loader',
    COMMENTS_FULL_COUNT: 'comments-count',
    COMMENTS_CURRENT_COUNT: 'comments-count',
  };

  var previewSelector = {
    BODY: 'body',
    PICTURE_IMG: '.picture__img',
    BIG_CLOSE: '.big-picture__cancel',
    BIG_IMG: '.big-picture__img > img',
    BIG_PICTURE: '.big-picture',

    COMMENT_LOADER: '.comments-loader',

    LIKES_COUNT: '.likes-count',

    SOCIAL_CAPTION: '.social__caption',
    SOCIAL_COMMENTS: '.social__comments',
    SOCIAL_COMMENT: '.social__comment',
    SOCIAL_COMMENT_COUNT: '.social__comment-count',
    COMMENTS_COUNT: '.comments-count',
    SOCIAL_PICTURE: '.social__picture',
    SOCIAL_TEXT: '.social__text',
  };

  var commentCountText = {
    FROM: ' из ',
    COMMENT: ' комментариев.',
    TAG: 'span'
  };

  var closeButton = document.querySelector(previewSelector.BIG_CLOSE);

  var previewBlock = document.querySelector(previewSelector.BIG_PICTURE);
  var loader = document.querySelector(previewSelector.COMMENT_LOADER);

  var renderCommentCount = function (countCurrent, countFull) {
    var socialCommentCount = previewBlock.querySelector(previewSelector.SOCIAL_COMMENT_COUNT);
    socialCommentCount.innerHTML = '';
    var commentsCountCurrent = document.createElement(commentCountText.TAG);
    commentsCountCurrent.classList.add(previewClass.COMMENTS_CURRENT_COUNT);
    commentsCountCurrent.textContent = countCurrent;
    var commentsCountFull = document.createElement(commentCountText.TAG);
    commentsCountFull.classList.add(previewClass.COMMENTS_FULL_COUNT);
    commentsCountFull.textContent = countFull;
    var textFrom = document.createTextNode(commentCountText.FROM);
    var textCommentaries = document.createTextNode(commentCountText.COMMENT);
    socialCommentCount.appendChild(commentsCountCurrent);
    socialCommentCount.appendChild(textFrom);
    socialCommentCount.appendChild(commentsCountFull);
    socialCommentCount.appendChild(textCommentaries);
  };

  var onClosePreview = function () {
    previewBlock.removeEventListener('click', onUpdateComments);
    window.util.closePopup(previewSelector.BIG_PICTURE, previewSelector.BODY);
  };

  var getPreviewData = function (element) {
    var pictureId = element.getAttribute('data-id');
    window.util.openPopup(previewSelector.BIG_PICTURE, previewSelector.BODY);
    window.preview.setPreview(window.gallery.elementList[pictureId]);

    closeButton.addEventListener('click', onClosePreview);
    previewBlock.addEventListener('click', onUpdateComments);
  };

  var onOpenPreview = function (evt) {
    if (evt.target.classList.contains(previewClass.CLICK_TRAGET)) {
      getPreviewData(evt.target);
    }
  };

  var onKeydownPreview = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      var tergetElement = evt.target.querySelector(previewSelector.PICTURE_IMG);
      getPreviewData(tergetElement);
    }
  };

  var onUpdateComments = function (evt) {
    if (evt.target.classList.contains(previewClass.LOADER)) {
      var commentList = evt.target.previousElementSibling.children;
      showComment(commentList);
    }
  };

  var getComment = function (commentsArr, template) {
    var commentTemplate = template.cloneNode(true);
    commentTemplate.classList.add(previewClass.VISUALLY_HIDDEN);
    commentTemplate.querySelector(previewSelector.SOCIAL_PICTURE).src = commentsArr.avatar;
    commentTemplate.querySelector(previewSelector.SOCIAL_TEXT).textContent = commentsArr.message;
    return commentTemplate;
  };

  var hideLoaderButton = function (isHide) {
    return (isHide) ? loader.classList.add(previewClass.HIDDEN) : loader.classList.remove(previewClass.HIDDEN);
  };

  var showComment = function (elementList) {
    var showStep = 0;
    var currentCount = 0;
    for (var i = 0; i < elementList.length && showStep < COMMENT_VIEW_MAX; i++) {
      if (elementList[i].classList.contains(previewClass.VISUALLY_HIDDEN)) {
        elementList[i].classList.remove(previewClass.VISUALLY_HIDDEN);
        showStep++;
      }
      currentCount++;
    }
    renderCommentCount(Math.min(currentCount, elementList.length), elementList.length);
    hideLoaderButton(elementList.length <= currentCount);
  };

  var renderCommentlist = function (data) {
    var socialComments = previewBlock.querySelector(previewSelector.SOCIAL_COMMENTS);
    var socialCommentList = socialComments.querySelectorAll(previewSelector.SOCIAL_COMMENT);
    var socialCommentTemplate = socialCommentList[0].cloneNode(true);
    window.util.removeChildren(socialComments, socialCommentList);

    var fragmentComments = document.createDocumentFragment();
    for (var k = 0; k < data.comments.length; k++) {
      var newComment = getComment(data.comments[k], socialCommentTemplate);
      fragmentComments.appendChild(newComment);
    }
    socialComments.appendChild(fragmentComments);
    return socialComments;
  };

  var setPreview = function (data) {
    previewBlock.querySelector(previewSelector.BIG_IMG).src = data.url;
    previewBlock.querySelector(previewSelector.LIKES_COUNT).textContent = data.likes;
    previewBlock.querySelector(previewSelector.SOCIAL_CAPTION).textContent = data.description;

    var commentList = renderCommentlist(data);
    showComment(commentList.children);
  };

  window.preview = {
    setPreview: setPreview,
    onOpenPreview: onOpenPreview,
    onKeydownPreview: onKeydownPreview
  };

})();
