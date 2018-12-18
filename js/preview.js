'use strict';

/* Модуль отрисовки Большой картинки */
/* Зависимости: data.js, util.js */

(function () {

  var previewSelector = {
    BIG_IMG: '.big-picture__img > img',
    BIG_PICTURE: '.big-picture',

    LIKES_COUNT: '.likes-count',

    SOCIAL_CAPTION: '.social__caption',
    SOCIAL_COMMENTS: '.social__comments',
    SOCIAL_COMMENT: '.social__comment',
    SOCIAL_PICTURE: '.social__picture',
    SOCIAL_TEXT: '.social__text',
  };

  var renderComment = function (commentsArr, template) {
    var commentTemplate = template.cloneNode(true);
    commentTemplate.querySelector(previewSelector.SOCIAL_PICTURE).src = commentsArr.avatar;
    commentTemplate.querySelector(previewSelector.SOCIAL_TEXT).textContent = commentsArr.text;
    return commentTemplate;
  };

  var removeChildren = function (parent, element) {
    for (var i = 0; i < element.length; i++) {
      parent.removeChild(element[i]);
    }
  };

  window.preview = {
    setPreview: function (current, picture) {
      var previewBlock = document.querySelector(previewSelector.BIG_PICTURE);

      previewBlock.querySelector(previewSelector.BIG_IMG).src = picture[current].url;
      previewBlock.querySelector(previewSelector.LIKES_COUNT).textContent = picture[current].likes;
      previewBlock.querySelector(previewSelector.SOCIAL_CAPTION).textContent = picture[current].description;

      var socialComments = previewBlock.querySelector(previewSelector.SOCIAL_COMMENTS);
      var socialCommentList = socialComments.querySelectorAll(previewSelector.SOCIAL_COMMENT);
      var socialCommentTemplate = socialCommentList[0].cloneNode(true);

      removeChildren(socialComments, socialCommentList);

      var fragmentComments = document.createDocumentFragment();
      for (var k = 0; k < window.data[current].comment.length; k++) {
        var newComment = renderComment(window.data[current].comment[k], socialCommentTemplate);
        fragmentComments.appendChild(newComment);
      }
      socialComments.appendChild(fragmentComments);
    }
  };

})();
