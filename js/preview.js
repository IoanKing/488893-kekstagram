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
  var socialCommentList = socialComment.querySelectorAll(window.ElementSelector.SOCIAL_COMMENT);
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

  var renderPreview = function (data) {
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

  var getComment = function (commentsArr, template) {
    var commentTemplate = template.cloneNode(true);
    commentTemplate.classList.add(window.ElementClass.VISUALLY_HIDDEN);
    commentTemplate.querySelector(window.ElementSelector.SOCIAL_PICTURE).src = commentsArr.avatar;
    commentTemplate.querySelector(window.ElementSelector.SOCIAL_TEXT).textContent = commentsArr.message;
    return commentTemplate;
  };

  var hideLoaderButton = function (isHide) {
    return (isHide) ? loader.classList.add(window.ElementClass.HIDDEN) : loader.classList.remove(window.ElementClass.HIDDEN);
  };

  var showComment = function (elementList) {
    var showStep = 0;
    var currentCount = 0;
    for (var i = 0; i < elementList.length && showStep < COMMENT_VIEW_MAX; i++) {
      if (elementList[i].classList.contains(window.ElementClass.VISUALLY_HIDDEN)) {
        elementList[i].classList.remove(window.ElementClass.VISUALLY_HIDDEN);
        showStep++;
      }
      currentCount++;
    }
    renderCommentCount(Math.min(currentCount, elementList.length), elementList.length);
    hideLoaderButton(elementList.length <= currentCount);
  };

  var renderCommentlist = function (data) {
    var socialCommentTemplate = socialCommentList[0].cloneNode(true);
    window.util.removeChildren(socialComment, socialCommentList);

    var fragmentComments = document.createDocumentFragment();
    var commentsList = data.comments;
    commentsList.forEach(function (comment) {
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
    renderPreview: renderPreview,
  };

})();
