// Файл uploadphoto.js
'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var previewStyle = {
    POSITION: '50% 50%',
    SIZE: 'cover'
  };

  var fileChooser = document.querySelector('#upload-file');
  var preview = document.querySelector('.img-upload__preview img');
  var filtersPreview = document.querySelectorAll('.effects__preview');

  var changeFilterPreviw = function (imagePath) {
    filtersPreview.forEach(function (element) {
      element.style.backgroundImage = 'url("' + imagePath + '")';
      element.style.backgroundPisition = previewStyle.POSITION;
      element.style.backgroundSize = previewStyle.SIZE;
    });
  };

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
        changeFilterPreviw(reader.result);
      });

      reader.readAsDataURL(file);
    }
  });
})();
