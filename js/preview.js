'use strict';

/* Модуль отрисовки Большой картинки */
/* Зависимости: data.js, util.js */

(function () {

  var COMMENT_VIEW_MAX = 5;

  var CLICK_TRAGET = 'picture__img';

  var previewSelector = {
    BODY: 'body',
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

  var closeButton = document.querySelector(previewSelector.BIG_CLOSE);

  var onClosePreview = function () {
    window.util.closePopup(previewSelector.BIG_PICTURE, previewSelector.BODY);
  };

  var onOpenPreview = function (evt) {

    if (evt.target.classList.contains(CLICK_TRAGET)) {
      var pictureId = evt.target.getAttribute('data-id');
      window.util.openPopup(previewSelector.BIG_PICTURE, previewSelector.BODY);
      window.preview.setPreview(window.pictures[pictureId]);
    }
    closeButton.addEventListener('click', onClosePreview);
  };

  var onKeydownPreview = function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      window.util.openPopup(previewSelector.BIG_PICTURE, previewSelector.BODY);
    }
  };

  var renderComment = function (commentsArr, template) {
    var commentTemplate = template.cloneNode(true);
    commentTemplate.querySelector(previewSelector.SOCIAL_PICTURE).src = commentsArr.avatar;
    commentTemplate.querySelector(previewSelector.SOCIAL_TEXT).textContent = commentsArr.message;
    return commentTemplate;
  };

  var removeChildren = function (parent, element) {
    for (var i = 0; i < element.length; i++) {
      parent.removeChild(element[i]);
    }
  };

  var setPreview = function (data) {
    var previewBlock = document.querySelector(previewSelector.BIG_PICTURE);

    previewBlock.querySelector(previewSelector.BIG_IMG).src = data.url;
    previewBlock.querySelector(previewSelector.LIKES_COUNT).textContent = data.likes;
    previewBlock.querySelector(previewSelector.SOCIAL_CAPTION).textContent = data.description;
    previewBlock.querySelector(previewSelector.COMMENTS_COUNT).textContent = data.comments.length;

    var socialComments = previewBlock.querySelector(previewSelector.SOCIAL_COMMENTS);
    var socialCommentList = socialComments.querySelectorAll(previewSelector.SOCIAL_COMMENT);
    var socialCommentTemplate = socialCommentList[0].cloneNode(true);

    removeChildren(socialComments, socialCommentList);

    var fragmentComments = document.createDocumentFragment();
    for (var k = 0; k < Math.min(data.comments.length, COMMENT_VIEW_MAX); k++) {
      var newComment = renderComment(data.comments[k], socialCommentTemplate);
      fragmentComments.appendChild(newComment);
    }
    socialComments.appendChild(fragmentComments);
  };

  window.preview = {
    setPreview: setPreview,
    onOpenPreview: onOpenPreview,
    onKeydownPreview: onKeydownPreview
  };

})();
