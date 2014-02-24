(function() {
  var COLORS = ["magenta", "cyan", "yellow", "lightgreen"],
      SHAPES = ["circle", "rect", "triangle"]; //, "plus"];
      
  Shapes.init("body");
  
  var currentShape = {
    shape: SHAPES[~~(Math.random() * SHAPES.length)],
    color: COLORS[~~(Math.random() * COLORS.length)]
  }, prevShape = null;
  
  var timeLeft = 30,
      inGame   = false;
      score    = 0,
      errors   = 0;
  
  var touchStartPoint = {x: 0, y: 0};
  
  document.body.addEventListener("animationend", function() { document.body.classList.remove("flash") }, false);
  
  var wasShape = function(test) {
    if(prevShape && prevShape.color == currentShape.color && prevShape.shape == currentShape.shape) {
      if(test == "same") {
        score++;
      } else {
        errors++;
      }
    } else if(prevShape) {
      if(test == "same") {
        errors++;
      } else {
        score++;
      }
    }
  };
  
  document.body.addEventListener("touchstart", function(e) {
    touchStartPoint.x = e.touches[0].clientX;
    touchStartPoint.y = e.touches[0].clientY;
  });
  
  document.body.addEventListener("touchend", function(e) {
    wasShap((e.changedTouches[0].clientX > touchStartPoint.x ? "different" : "same"));
  });
  
  document.body.addEventListener("keypress", function(e) {
    console.log(e.keyCode);
    switch(e.keyCode) {
      //LEFT
      case 97:
        console.log("A: ", prevShape, currentShape);
        wasShape("same");
        nextShape();
        break;
      //RIGHT        
      case 108:
        console.log("L", prevShape, currentShape);
        wasShape("different");
        nextShape();
        break;
      case 32: //Space
        console.log("SPAAACE");
        e.preventDefault();
        if(inGame) return;
        startGame();
        inGame = true;
        window.scrollTo(0);
        break;
    }
    console.log("RET");
    return false;
  });
  
  var nextShape = function() {
    document.body.classList.add("flash");
    prevShape = currentShape;
    if(Math.random() >= 0.5) {
      currentShape = {
        shape: SHAPES[~~(Math.random() * SHAPES.length)],
        color: COLORS[~~(Math.random() * COLORS.length)]
      };
    }
    Shapes.clear();
    Shapes.drawShape(currentShape.shape, currentShape.color); 
  }
  
  var startGame = function() {
    timeLeft = 30;
    prevShape = null;
    Shapes.drawShape(currentShape.shape, currentShape.color);    
    setTimeout(function loop() {
      if(timeLeft > 1) { setTimeout(loop, 1000); }
      else {
        inGame = false;
        alert("You made a score of " + score + " ( " + (score / 30.0).toPrecision(2) + " shapes/s)and " + errors + " mistakes");
      }
      timeLeft--;
      document.getElementById("state").textContent = timeLeft;
    }, 1000);
  };
  
})();
