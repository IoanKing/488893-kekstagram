'use strict';

/* Модуль загрузки фотографии в Preview */
/* Зависимости: constants.js */

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var PreviewStyle = {
    POSITION: '50% 50%',
    SIZE: 'cover'
  };

  var fileChooser = document.querySelector(window.ElementSelector.UPLOAD_FILE);
  var preview = document.querySelector(window.ElementSelector.PREVIEW_IMG);
  var filtersPreview = document.querySelectorAll(window.ElementSelector.PREVIEW_EFFECTS);

  var changeFilterPreviw = function (imagePath) {
    filtersPreview.forEach(function (element) {
      element.style.backgroundImage = 'url("' + imagePath + '")';
      element.style.backgroundPisition = PreviewStyle.POSITION;
      element.style.backgroundSize = PreviewStyle.SIZE;
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
