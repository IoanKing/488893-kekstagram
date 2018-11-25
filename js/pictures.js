
/* --------------- CONSTANS -----------------*/
var PICTURES_COUNT = 25;
var COMMENT_AVATAR_COUNT = 6;
var MAX_COUNT_COMMENTS = 2;
var MAX_LIKE_VALUE = 200;

var PICTURE_SELECTOR = '.pictures';
var PICTURE_TAMPLATE_SELECTOR = '#picture';
var PICTURE_ITEM_SELECTOR = '.picture';
var PICTURE_LINK_SELECTOR = '.picture__img';
var PICTURE_LIKES_SELECTOR = '.picture__likes';
var PICTURE_COMMENT_SELECTOR = '.picture__comments';

var PICTURE_PATCH = 'photos/';
var PICTURE_FORMAT = '.jpg';

var COMMENT_AVATAR_PATCH = 'img/avatar-';
var COMMENT_AVATAR_FORMAT = '.svg';

var BIG_PICTURE_SELECTOR = '.big-picture';
var BIG_IMG_SELECTOR = '.big-picture__img > img';
var BIG_CLOSE_SELECTOR = '.big-picture__cancel';

var HIDDEN_CLASS = 'hidden';

var LIKES_COUNT_SELECTOR = '.likes-count';

var SOCIAL_CAPTION_SELECTOR = '.social__caption';
var SOCIAL_COMMENTS_SELECTOR = '.social__comments';
var SOCIAL_COMMENT_SELECTOR = '.social__comment';
var SOCIAL_PICTURE_SELECTOR = '.social__picture';
var SOCIAL_TEXT_SELECTOR = '.social__text';

/* --------------- ARRAYS -----------------*/

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!',
];

/* --------------- FUNCTIONS -----------------*/

var randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var randomElementOfArr = function (arr) {
  return arr[randomInt(0, arr.length)];
};

var createPicture = function (urlPicture, commentToPicture, descriptionToPicture, maxComments) {
  var randomCountComments = randomInt(0, maxComments);
  var commentsToPicture = [];
  for (var i = 0; i <= randomCountComments; i++) {
    commentsToPicture.push(randomElementOfArr(commentToPicture));
  }
  return {
    url: PICTURE_PATCH + urlPicture + PICTURE_FORMAT,
    likes: randomInt(1, MAX_LIKE_VALUE),
    comment: commentsToPicture,
    description: randomElementOfArr(descriptionToPicture)
  };
};

var fillPicturesCollection = function (commentToPicture, descriptionToPicture, countPicture, countComments) {
  var arr = [];
  for (var i = 1; i <= countPicture; i++) {
    arr.push(createPicture(i, commentToPicture, descriptionToPicture, countComments));
  }
  return arr;
};

var renderPictures = function (picturesArr, picturesTemplate) {
  var pictureElement = picturesTemplate.cloneNode(true);
  pictureElement.querySelector(PICTURE_LINK_SELECTOR).src = picturesArr.url;
  pictureElement.querySelector(PICTURE_LIKES_SELECTOR).textContent = picturesArr.likes;
  pictureElement.querySelector(PICTURE_COMMENT_SELECTOR).textContent = picturesArr.comment.length;

  return pictureElement;
};

var createComment = function (commentsArr, template) {
  var commentTemplate = template.cloneNode(true);
  commentTemplate.querySelector(SOCIAL_PICTURE_SELECTOR).src = COMMENT_AVATAR_PATCH + randomInt(1, COMMENT_AVATAR_COUNT) + COMMENT_AVATAR_FORMAT;
  commentTemplate.querySelector(SOCIAL_TEXT_SELECTOR).textContent = commentsArr;
  return commentTemplate;
};

var setBigPicture = function (current, block, picturesObj) {
  block.querySelector(BIG_IMG_SELECTOR).src = picturesObj[current].url;
  block.querySelector(LIKES_COUNT_SELECTOR).textContent = picturesObj[current].likes;
  block.querySelector(SOCIAL_CAPTION_SELECTOR).textContent = picturesObj[current].description;
}

var removeAllChild = function (parent, element) {
  for (var i = 0; i < element.length; i++) {
    parent.removeChild(element[i]);
  }
}

/*------- create Pictures collections --------*/

var pictures = fillPicturesCollection(comments, descriptions, PICTURES_COUNT, MAX_COUNT_COMMENTS);
var picturesElement = document.querySelector(PICTURE_SELECTOR)
var picturesTemplate = document.querySelector(PICTURE_TAMPLATE_SELECTOR)
    .content
    .querySelector(PICTURE_ITEM_SELECTOR);

var fragment = document.createDocumentFragment();
for (var j = 0; j < pictures.length; j++) {
  fragment.appendChild(renderPictures(pictures[j], picturesTemplate));
}
picturesElement.appendChild(fragment);

/*------- change Big Picture --------*/

var picturesList = document.querySelectorAll(PICTURE_ITEM_SELECTOR);
var pictureBlock = document.querySelector(BIG_PICTURE_SELECTOR);

picturesList.forEach(function (element, i) {
  element.addEventListener('click', function (evt) {
    evt.preventDefault();

    var currentPictureId = i;

    pictureBlock.classList.remove(HIDDEN_CLASS);

    setBigPicture(currentPictureId, pictureBlock, pictures);

    var socialComments = pictureBlock.querySelector(SOCIAL_COMMENTS_SELECTOR);
    var socialCommentList = socialComments.querySelectorAll(SOCIAL_COMMENT_SELECTOR);
    var socialCommantTemplate = socialCommentList[0].cloneNode(true);

    removeAllChild(socialComments, socialCommentList);

    var fragmentComments = document.createDocumentFragment();
    for (var j = 0; j < pictures[currentPictureId].comment.length; j++) {
      var newComment = createComment(pictures[currentPictureId].comment[j], socialCommantTemplate);
      fragmentComments.appendChild(newComment);
    }
    socialComments.appendChild(fragmentComments);
  })
});

var closeModal = document.querySelector(BIG_CLOSE_SELECTOR);

if (closeModal) {
  closeModal.addEventListener('click', function (evt) {
    evt.preventDefault();
    pictureBlock.classList.add(HIDDEN_CLASS);
  });
}
