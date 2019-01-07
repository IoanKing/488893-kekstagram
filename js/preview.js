'use strict';

/* Модуль отрисовки Большой картинки */
/* Зависимости: data.js, util.js */

(function () {

  var COMMENT_VIEW_MAX = 5;

  var previewClass = {
    HIDDEN: 'hidden',
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
    COMMENT: ' комментариев.'
  };

  var closeButton = document.querySelector(previewSelector.BIG_CLOSE);

  var previewBlock = document.querySelector(previewSelector.BIG_PICTURE);
  var loader = document.querySelector(previewSelector.COMMENT_LOADER);

  var socialCommentCount = previewBlock.querySelector(previewSelector.SOCIAL_COMMENT_COUNT);

  socialCommentCount.innerHTML = '';
  var commentsCountCurrent = document.createElement('span');
  commentsCountCurrent.classList.add(previewClass.COMMENTS_CURRENT_COUNT);
  var commentsCountFull = document.createElement('span');
  commentsCountFull.classList.add(previewClass.COMMENTS_FULL_COUNT);
  var textFrom = document.createTextNode(commentCountText.FROM);
  var textCommentaries = document.createTextNode(commentCountText.COMMENT);
  socialCommentCount.appendChild(commentsCountCurrent);
  socialCommentCount.appendChild(textFrom);
  socialCommentCount.appendChild(commentsCountFull);
  socialCommentCount.appendChild(textCommentaries);

  var maxComment = 0;
  var commentsData;

  var onClosePreview = function () {
    previewBlock.removeEventListener('click', onUpdateComments);
    window.util.closePopup(previewSelector.BIG_PICTURE, previewSelector.BODY);
  };

  var getPreviewData = function () {
    var targetElement = document.activeElement.querySelector(previewSelector.PICTURE_IMG);
    var pictureId = targetElement.getAttribute('data-id');
    window.util.openPopup(previewSelector.BIG_PICTURE, previewSelector.BODY);
    commentsData = window.gallery.elementList[pictureId];
    maxComment = Math.min(COMMENT_VIEW_MAX, commentsData.comments.length);
    window.preview.setPreview();

    closeButton.addEventListener('click', onClosePreview);
    previewBlock.addEventListener('click', onUpdateComments);
  };

  var onOpenPreview = function (evt) {
    if (evt.target.classList.contains(previewClass.CLICK_TRAGET)) {
      getPreviewData();
    }
  };

  var onUpdateComments = function (evt) {
    if (evt.target.classList.contains(previewClass.LOADER)) {
      maxComment = Math.min(maxComment + COMMENT_VIEW_MAX, commentsData.comments.length);
      commentsCountCurrent.textContent = maxComment;
      renderCommentlist(commentsData);
    }
  };

  var onKeydownPreview = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      getPreviewData();
    }
  };

  var renderComment = function (commentsArr, template) {
    var commentTemplate = template.cloneNode(true);
    commentTemplate.querySelector(previewSelector.SOCIAL_PICTURE).src = commentsArr.avatar;
    commentTemplate.querySelector(previewSelector.SOCIAL_TEXT).textContent = commentsArr.message;
    return commentTemplate;
  };

  var renderCommentlist = function () {
    var socialComments = previewBlock.querySelector(previewSelector.SOCIAL_COMMENTS);
    var socialCommentList = socialComments.querySelectorAll(previewSelector.SOCIAL_COMMENT);
    var socialCommentTemplate = socialCommentList[0].cloneNode(true);

    if (commentsData.comments.length <= maxComment) {
      loader.classList.add(previewClass.HIDDEN);
    } else {
      loader.classList.remove(previewClass.HIDDEN);
    }

    window.util.removeChildren(socialComments, socialCommentList);

    var fragmentComments = document.createDocumentFragment();
    for (var k = 0; k < maxComment; k++) {
      var newComment = renderComment(commentsData.comments[k], socialCommentTemplate);
      fragmentComments.appendChild(newComment);
    }
    socialComments.appendChild(fragmentComments);
  };

  var setPreview = function () {
    previewBlock.querySelector(previewSelector.BIG_IMG).src = commentsData.url;
    previewBlock.querySelector(previewSelector.LIKES_COUNT).textContent = commentsData.likes;
    previewBlock.querySelector(previewSelector.SOCIAL_CAPTION).textContent = commentsData.description;
    commentsCountCurrent.textContent = maxComment;
    commentsCountFull.textContent = commentsData.comments.length;

    renderCommentlist();
  };

  window.preview = {
    setPreview: setPreview,
    onOpenPreview: onOpenPreview,
    onKeydownPreview: onKeydownPreview
  };

})();
