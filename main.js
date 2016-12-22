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
    
    $.get('/data/pipeline-1.json').done(function(data) {
        editor.set(data);
        draw(data, false);
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
    _.each(data.states, function(state, id) {
        var className = state.name ? "running" : "stopped";
        var html = "<div>";
          html += "<span class='status'></span>";
          html += "<span class='consumers'>"+state.name+"</span>";
          html += "</div>";
      
      g.setNode(id, {
        labelType: "html",
        label: html,
        rx: 5,
        ry: 5,
        padding: 0,
        class: className
      });

      var x = _.keys(data.flow[state.name])[0];
      if(x) {
          g.setEdge(id, x, {
              label: "edge",
              width: 40
            });  
      }
    })

    inner.call(render, g);
    // Zoom and scale to fit
    var graphWidth = g.graph().width + 80;
    var graphHeight = g.graph().height + 40;
    var width = parseInt(svg.style("width").replace(/px/, ""));
    var height = parseInt(svg.style("height").replace(/px/, ""));
    var zoomScale = Math.min(width / graphWidth, height / graphHeight);
    var translate = [(width/2) - ((graphWidth*zoomScale)/2), (height/2) - ((graphHeight*zoomScale)/2)];
    zoom.translate(translate);
    zoom.scale(zoomScale);
    zoom.event(isUpdate ? svg.transition().duration(500) : d3.select("svg"));
  }
});

