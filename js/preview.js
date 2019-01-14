'use strict';

/* Модуль отрисовки Большой картинки Preview */
/* Зависимости: constants.js, data.js, util.js */

(function () {

  var COMMENT_VIEW_MAX = 5;

  var commentCountText = {
    FROM: ' из ',
    TAG_BEGIN: '<span ="comments-count">',
    TAG_END: '</span>',
    COMMENT: ' комментариев.'
  };

  var closeButton = document.querySelector(window.ElementSelector.BIG_CLOSE);

  var previewBlock = document.querySelector(window.ElementSelector.BIG_PICTURE);
  var loader = document.querySelector(window.ElementSelector.COMMENT_LOADER);
  var socialComment = previewBlock.querySelector(window.ElementSelector.SOCIAL_COMMENTS);
  var previewImg = previewBlock.querySelector(window.ElementSelector.BIG_IMG);
  var previewLike = previewBlock.querySelector(window.ElementSelector.LIKES_COUNT);
  var previewSocialCaption = previewBlock.querySelector(window.ElementSelector.SOCIAL_CAPTION);

  var renderCommentCount = function (countCurrent, countFull) {
    var socialCommentCount = previewBlock.querySelector(window.ElementSelector.SOCIAL_COMMENT_COUNT);
    socialCommentCount.innerHTML = '';
    socialCommentCount.innerHTML = countCurrent + commentCountText.FROM + commentCountText.TAG_BEGIN + countFull + commentCountText.TAG_END + commentCountText.COMMENT;
  };

  var onClosePreview = function () {
    previewBlock.removeEventListener('click', onUpdateComments);
    closeButton.removeEventListener('click', onClosePreview);
    window.util.closePopup(window.ElementSelector.BIG_PICTURE, window.ElementSelector.BODY);
  };

  var showPreview = function (data) {
    window.util.openPopup(window.ElementSelector.BIG_PICTURE, window.ElementSelector.BODY);
    setPreview(data);
    closeButton.addEventListener('click', onClosePreview);
    previewBlock.addEventListener('click', onUpdateComments);
  };

  var onUpdateComments = function (evt) {
    if (evt.target.classList.contains(window.ElementClass.LOADER)) {
      var commentList = evt.target.previousElementSibling.children;
      showComment(commentList);
    }
  };

  var getComment = function (comments, template) {
    var commentTemplate = template.cloneNode(true);
    commentTemplate.classList.add(window.ElementClass.VISUALLY_HIDDEN);
    commentTemplate.querySelector(window.ElementSelector.SOCIAL_PICTURE).src = comments.avatar;
    commentTemplate.querySelector(window.ElementSelector.SOCIAL_TEXT).textContent = comments.message;
    return commentTemplate;
  };

  var hideLoaderButton = function (isHide) {
    return (isHide) ? loader.classList.add(window.ElementClass.HIDDEN) : loader.classList.remove(window.ElementClass.HIDDEN);
  };

  var showComment = function (elements) {
    var showStep = 0;
    var currentCount = 0;
    for (var i = 0; i < elements.length && showStep < COMMENT_VIEW_MAX; i++) {
      if (elements[i].classList.contains(window.ElementClass.VISUALLY_HIDDEN)) {
        elements[i].classList.remove(window.ElementClass.VISUALLY_HIDDEN);
        showStep++;
      }
      currentCount++;
    }
    renderCommentCount(Math.min(currentCount, elements.length), elements.length);
    hideLoaderButton(elements.length <= currentCount);
  };

  var renderCommentlist = function (data) {
    var socialCommentList = socialComment.querySelectorAll(window.ElementSelector.SOCIAL_COMMENT);
    var socialCommentTemplate = socialCommentList[0].cloneNode(true);
    window.util.removeChildren(socialComment, socialCommentList);

    var fragmentComments = document.createDocumentFragment();
    var comments = data.comments;
    comments.forEach(function (comment) {
      var newComment = getComment(comment, socialCommentTemplate);
      fragmentComments.appendChild(newComment);
    });
    socialComment.appendChild(fragmentComments);
    return socialComment;
  };

  var setPreview = function (data) {
    previewImg.src = data.url;
    previewLike.textContent = data.likes;
    previewSocialCaption.textContent = data.description;

    var commentList = renderCommentlist(data);
    showComment(commentList.children);
  };

  window.preview = {
    show: showPreview,
  };

})();
