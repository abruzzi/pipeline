$(function() {
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
    
    $.get('/data/pipeline-2.json').done(function(data) {
        editor.set(data);
        draw(data, false);
    });

    $('#create').on('click', function(e) {
        var data = editor.get();
        draw(data, true);
    });

  // Set up zoom support
  var svg = d3.select("svg"),
      inner = svg.select("g"),
      zoom = d3.behavior.zoom().on("zoom", function() {
        inner.attr("transform", "translate(" + d3.event.translate + ")" +
                                    "scale(" + d3.event.scale + ")");
      });

  svg.call(zoom);
  var render = new dagreD3.render();
  
  // Left-to-right layout
  var g = new dagreD3.graphlib.Graph();

  g.setGraph({
    nodesep: 70,
    ranksep: 50,
    rankdir: "LR",
    marginx: 20,
    marginy: 20
  });

  function draw(data, isUpdate) {
    _.each(data.states, function(state, key) {
        var className = state.name ? "running" : "stopped";
        var html = "<div>";
          html += "<span class='status'></span>";
          html += "<span class='consumers'>"+state.name+"</span>";
          html += "</div>";
      
      g.setNode(key, {
        labelType: "html",
        label: html,
        rx: 5,
        ry: 5,
        padding: 0,
        class: className
      });

      var downStreams = _.keys(data.flow[state.name]);
      _.each(downStreams, function(downStream) {
        g.setEdge(key, downStream, {
          label: "edge",
          width: 40
        });  
      });

    })

    inner.call(render, g);
  }
});

