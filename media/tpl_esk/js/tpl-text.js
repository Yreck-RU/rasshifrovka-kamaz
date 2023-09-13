(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        var editorOptions = document.querySelectorAll('.editor-option');

        editorOptions.forEach(function (element) {
            element.addEventListener('click', function (event) {
                event.preventDefault();
                var id = event.target.getAttribute('data-id');
                var editor = event.target.getAttribute('data-editor');

                if (window.parent.Joomla && window.parent.Joomla.editors && window.parent.Joomla.editors.instances &&
                    Object.prototype.hasOwnProperty.call(window.parent.Joomla.editors.instances, editor))
                {
                    window.parent.Joomla.editors.instances[editor].replaceSelection('{option id="' + id + '"}');
                }

                if (window.parent.Joomla.Modal)
                {
                    window.parent.Joomla.Modal.getCurrent().close();
                }
            });
        });
    });

})();