var Shapes = (function() {
  var self = this;
  var svg  = null; 
  
  var WIDTH  = window.screen.availWidth,
      HEIGHT = window.screen.availHeight;
      
  // Private methods
  var shapes = {};
  
  shapes.circle = function(color) {
    svg.append("circle").attr("cx", "50%").attr("cy", "50%").attr("r", "20%").attr("fill", color);
  };
  
  shapes.rect = function(color) {
    svg.append("rect").attr("x", "25%").attr("y", "25%").attr("width", "50%").attr("height", "50%").attr("fill", color);
  };
  
  shapes.triangle = function(color) {
  var lineFunc = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");
    
    var center = {x: WIDTH/2, y: HEIGHT/2},
        dx     = WIDTH/6,
        dy     = HEIGHT/6;
    
    svg.append("path")
      .attr("d", lineFunc([
        {x: center.x-dx, y: center.y+dy},
        {x: center.x   , y: center.y-dy},
        {x: center.x+dx, y: center.y+dy}
      ]))
      .attr("fill", color);
  };

  shapes.plus = function(color) {
    svg.append("rect").attr("x", "25%").attr("y", "25%").attr("width", "50%").attr("height", "50%").attr("fill", color);
  };

  // Public methods
  
  self.init = function(elemSelector) {
    svg = d3.select(elemSelector).append("svg").attr("width", "100%").attr("height", "100%");
  };
  
  self.clear = function() {
    svg.text("");
  };
  
  self.drawShape = function(shape, color) {
    shapes[shape](color);
  };
  
  return self;
})();
