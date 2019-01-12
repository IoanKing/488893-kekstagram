// Файл uploadphoto.js
'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var previewStyle = {
    POSITION: '50% 50%',
    SIZE: 'cover'
  };

  var uploadsSelectors = {
    UPLOAD_FILE: '#upload-file',
    PREVIEW_IMG: '.img-upload__preview img',
    PREVIEW_EFFECTS: '.effects__preview'
  };

  var fileChooser = document.querySelector(uploadsSelectors.UPLOAD_FILE);
  var preview = document.querySelector(uploadsSelectors.PREVIEW_IMG);
  var filtersPreview = document.querySelectorAll(uploadsSelectors.PREVIEW_EFFECTS);

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
        window.forms.setEffect('none');
        window.forms.setScale(0);
        changeFilterPreviw(reader.result);
      });

      reader.readAsDataURL(file);
    }
  });
})();
