(function() {
  var COLORS = ["magenta", "cyan", "yellow", "lightgreen"],
      SHAPES = ["circle", "rect", "triangle"]; //, "plus"];
      
  Shapes.init("body");
  
  var keyboardOnlyElems = document.querySelectorAll(".keyboard"),
      touchOnlyElems    = document.querySelectorAll(".touch");
  if("ontouchstart" in window) {
    for(var i=0; i<keyboardOnlyElems.length; i++) {
      keyboardOnlyElems[i].style.display = "none";
    }
    for(var i=0; i<touchOnlyElems.length; i++) {
      touchOnlyElems[i].style.display = "block";
    }
  } else {
    for(var i=0; i<keyboardOnlyElems.length; i++) {
      keyboardOnlyElems[i].style.display = "block";
      console.log(keyboardOnlyElems[i].style.display);
    }
    for(var i=0; i<touchOnlyElems.length; i++) {
      console.log(touchOnlyElems[i].style.display);
      touchOnlyElems[i].style.display = "none";
    }
  }
  
  var currentShape = {
    shape: SHAPES[~~(Math.random() * SHAPES.length)],
    color: COLORS[~~(Math.random() * COLORS.length)]
  }, prevShape = null;
  
  var timeLeft = 30,
      inGame   = false;
      score    = 0,
      errors   = 0;
  
  document.body.addEventListener("animationend", function() { document.body.classList.remove("flash") }, false);
  
  document.body.addEventListener("keypress", function(e) {
    console.log(e.keyCode);
    switch(e.keyCode) {
      //LEFT
      case 97:
        console.log("A: ", prevShape, currentShape);
        if(prevShape && prevShape.color == currentShape.color && prevShape.shape == currentShape.shape) {
          score++;
        } else if(prevShape) {
          errors++;
        }
        nextShape();
        break;
      //RIGHT        
      case 108:
        console.log("L", prevShape, currentShape);
        if(prevShape && prevShape.color == currentShape.color && prevShape.shape == currentShape.shape) {
          errors++;
        } else if(prevShape) {
          score++;
        }
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