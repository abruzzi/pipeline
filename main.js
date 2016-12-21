// create the editor
var container = document.getElementById("jsoneditor");

var options = {
    mode: 'code',
    modes: ['code', 'tree', 'view'], // allowed modes
    onError: function (err) {
      alert(err.toString());
    },
    onModeChange: function (newMode, oldMode) {
      console.log('Mode switched from', oldMode, 'to', newMode);
    }
};

var editor = new JSONEditor(container, options);

// get json
var json = editor.get();

$(function() {
    
})