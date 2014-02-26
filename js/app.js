window.addEventListener("deviceready", function() {
  console.log("Device ready");
  window.initApp = this;
  var COLORS = ["magenta", "cyan", "yellow", "lightgreen"],
      SHAPES = ["circle", "rect", "triangle"]; //, "plus"];
      
  Shapes.init("#game");
  
  var currentShape = {
    shape: SHAPES[~~(Math.random() * SHAPES.length)],
    color: COLORS[~~(Math.random() * COLORS.length)]
  }, prevShape = null;
  
  var timeLeft = 30,
      inGame   = false;
      score    = 0,
      errors   = 0;
  
  var touchStartPoint = {x: 0, y: 0};
  
  // determine if we're having touch capabilities
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

  // some internal helpers
  
  var gotoSection = function(id) {
    var prev = document.querySelector(".prev");
    if(prev) prev.classList.remove("prev");
    var cl = document.querySelector("section.current").classList;
    cl.remove("current");
    cl.add("prev");
    document.getElementById(id).classList.add("current");
  };  
  
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
  
  var nextShape = function() {
    document.getElementById("currentScore").textContent = score - errors;
    document.getElementById("scoreNow").classList.add("flash");
    
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
    score    = 0;
    errors   = 0;
    prevShape = null;
    Shapes.drawShape(currentShape.shape, currentShape.color);    
    setTimeout(function loop() {
      if(timeLeft > 1) { setTimeout(loop, 1000); }
      else {
        inGame = false;
        
        var maxScore = parseInt(window.localStorage.getItem("highscore") || "0", 10);
        
        document.getElementById("totalScore").textContent   = score - errors;
        document.getElementById("score").textContent        = score;
        document.getElementById("errors").textContent       = errors;
        document.getElementById("shapesPerSec").textContent = (score / 30.0).toPrecision(2);
        document.getElementById("best").textContent         = maxScore;
        
        if((score - errors) > maxScore) {
          document.getElementById("best").textContent += " (NEW highscore!)";
          window.localStorage.setItem("highscore", (score-errors));
        }
        
        gotoSection("result");
      }
      timeLeft--;
      document.getElementById("state").textContent = timeLeft;
    }, 1000);
  };
  
  // event handling
  
  document.body.addEventListener("animationend", function() { document.querySelector(".flash").classList.remove("flash") }, false);
  
  document.body.addEventListener("touchstart", function(e) {
    touchStartPoint.x = e.touches[0].clientX;
    touchStartPoint.y = e.touches[0].clientY;
    e.preventDefault();
  });
  
  document.body.addEventListener("touchmove", function(e) {
    e.preventDefault();
    document.querySelector("svg").style.left = (e.changedTouches[0].clientX - touchStartPoint.x) + "px";
  });
  
  document.body.addEventListener("touchend", function(e) {
    document.querySelector("svg").style.left = "0px";
    
    if(Math.abs(e.changedTouches[0].clientY - touchStartPoint.y) > 50 && !inGame) {
      inGame = true;
      gotoSection("game");
      startGame();
      return;
    }
    if(Math.abs(e.changedTouches[0].clientX - touchStartPoint.x) < 30) return;
    
    wasShape((e.changedTouches[0].clientX > touchStartPoint.x ? "different" : "same"));
    nextShape();
    
    touchStartPoint.x = e.changedTouches[0].clientX;
    touchStartPoint.y = e.changedTouches[0].clientY;
    
    e.preventDefault();
  });
  
  document.body.addEventListener("keypress", function(e) {
    switch(e.keyCode) {
      //LEFT (A)
      case 97:
        wasShape("same");
        nextShape();
        break;
      //RIGHT (L)
      case 108:
        wasShape("different");
        nextShape();
        break;
      case 32: //Space
        e.preventDefault();

        if(inGame) return;

        startGame();
        inGame = true;
        gotoSection("game");
        window.scrollTo(0);
        break;
    }
    return false;
  });
  console.log("Worked.");  
});
