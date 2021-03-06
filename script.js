//array of icons
    var icons = [
      "bath",
      "bug",
      "bowling-ball",
      "coffee",
      "couch",
      "football-ball",
      "gem",
      "laptop"
    ];

    var score;
    // Boolean value, is game started alreay
    var gameplay;
    // Hold anomation frame
    var reqUpdate;
    var mDown = false;
    // every time we hit one of the bad guys we decrease BGcount
    var BGcount = 10;
    var hazards = 3;
    // Grab element and move around with cursor
    var container = document.querySelector(".container");
    var crossHair = document.querySelector(".crossHair");
    var gameover = document.querySelector(".gameover");
    var baddy = document.querySelector(".baddy");
    var btnStart = document.querySelector(".btnStart");
    var myContainer = {
      width: container.offsetWidth,
      height: container.offsetHeight,
      left: container.offsetLeft,
      top: container.offsetTop
    };

    // capture or bubble item by setting mDown variable
    /*
    container.addEventListener(
      "mousedown",
      function() {
        mDown = true;
      },
      true
    );
    container.addEventListener(
      "mouseup",
      function() {
        mDown = false;
      },
      true
    );
    */

    // whenever we're in the container move crossHair arround
    // last elemenet: true because we've not any other elements to interract with
    container.addEventListener("mousemove", move, true);
    btnStart.addEventListener("click", startGame);
    container.addEventListener("mousedown", mouseDown, true);

    // pass event information - e
    function mouseDown(e) {
      if (gameplay) {
        var div = document.createElement('div');
        div.setAttribute('class', 'fireme');
        div.style.left = (e.clientX - 140) + 'px';
        div.style.top = (e.clientY - 100) + 'px';
        div.dataset.counter = 100;
        div.style.width = 100 + 'px';
        div.style.height = 100 + 'px';
        container.appendChild(div);
      }
    }

    function startGame() {
      if (!gameplay) {
        BGcount = 10;

        score = 0;
        hazards = 3;

        //Create bombs
        setupBadguys(6);

        gameplay = true;
        gameover.style.display = "none";

        reqUpdate = window.requestAnimationFrame(update);
      }
    }

    function endGame() {
      gameover.style.display = "block";
      gameover.innerHTML = "GAME OVER <br>SCORE " + score;
      gameplay = false;

      var tempEnemy = document.querySelectorAll(".baddy"); // returnt an array of elements
      for (var e of tempEnemy) {
        // Remove element
        e.parentNode.removeChild(e);
      }

      var tempShots = document.querySelectorAll(".fireme"); // returnt an array of elements
      for (var shot of tempShots) {
        // Remove element
        shot.parentNode.removeChild(shot);
      }
    }

    function setupBadguys(num) {
      for (let x = 0; x < num; x++) {
        badMaker();
      }
    }

    function randomColor() {
      function c() {
        var hex = Math.floor(Math.random() * 256).toString(16);
        var response = ("0" + String(hex)).substr(-2);
        return response;
      }
      return "#" + c() + c() + c();
      // console.log('#'+c()+c()+c());
    }

    function badMaker() {
      var div = document.createElement("div");
      // Between 50-100
      var randomWidth = Math.floor(Math.random() * 50) + 50;

      var iconRan;

      if (hazards > 0) {
        hazards--;
        iconRan = "fa-bomb";
        div.dataset.points = 0;
        div.style.color = "white";
        div.style.backgroundColor = "black";
        randomWidth = 150;
      } else {
        // Get random icons
        var iconRan = "fa-" + icons[Math.floor(Math.random() * icons.length)];

        // Set point for element
        div.dataset.points = Math.ceil(Math.random() * 10) + 2;
        // Between 50-100
        var randomWidth = Math.floor(Math.random() * 50) + 50;
        div.style.color = randomColor();
      }

      // Get random icons
      // var iconRan = "fa-" + icons[Math.floor(Math.random() * icons.length)];

      // Random position
      // myContainer.width - dealing with vertical width
      // substract with of element we created (randomWidth)
      var x = Math.floor(Math.random() * (myContainer.width - randomWidth));
      var y = Math.floor(Math.random() * (myContainer.height - randomWidth));

      div.innerHTML = '<i class="fas ' + iconRan + '">';
      div.setAttribute("class", "baddy");
      // Set point for element
      // div.dataset.points = Math.ceil(Math.random() * 10) + 2;
      //Moving speed of item
      div.dataset.speed = Math.ceil(Math.random() * 10) + 2;
      // Moving direction of item
      // div.dataset.dir = Math.ceil(Math.random() * 4);
      // Moving direction of item up to 8 directions (up, down, left, right, diagonal)
      div.dataset.dir = Math.ceil(Math.random() * 8);
      // How many iterations it's gona move to the same direction
      div.dataset.mover = Math.ceil(Math.random() * 15) + 2;
      div.style.fontSize = randomWidth + "px";
      // We'll substract because we don't want image to get out of borders
      div.style.lineHeight = randomWidth - randomWidth * 0.3 + "px";
      div.style.height = randomWidth + "px";
      // div.style.color = randomColor();
      div.style.left = x + "px";
      div.style.top = y + "px";
      container.appendChild(div);
    }

    function update() {
      // console.log("Game in play");

      // Commented because we're creating elements dynamically
      // console.log(isCollision(crossHair, baddy));

      // ANIMATION
      // gameplay loop        
      if (!gameplay) {
        // Stop animation
        window.cancelAnimationFrame(reqUpdate);
      } else {
        reqUpdate = window.requestAnimationFrame(update);
      }

      // Capture all of our shots
      var tempShots = document.querySelectorAll('.fireme');
      for (var shot of tempShots) {
        fireMover(shot);
      }

      var tempEnemy = document.querySelectorAll(".baddy"); // returnt an array of elements

      for (var enemy of tempEnemy) {
        // console.log(isCollision(crossHair, enemy));
        itemMover(enemy);
      }
    }

    function fireMover(e) {
      // How long the element will stay there
      if (e.dataset.counter < 1) {
        e.parentNode.removeChild(e);
      } else {
        // move the element and make it smaller
        e.style.left = parseInt(e.style.left) + 1.5 + 'px';
        e.style.top = parseInt(e.style.top) + 1.5 + 'px';
        e.style.width = e.dataset.counter + 'px';
        e.style.height = e.dataset.counter + 'px';
        e.dataset.counter -= 3;
      }
    }

    function itemMover(e) {
      // console.log(e);

      // Capture all of our shots
      var tempShots = document.querySelectorAll('.fireme');
      for (var shot of tempShots) {
        // Check if shot collide with badguys
        if (isCollision(shot, e)) {
          // if we've collided with hazards
          if (e.dataset.points == 0) {
            endGame();
            return;
          }
          // Remove the shot
          shot.parentNode.removeChild(shot);
          // Remove the target element
          e.parentNode.removeChild(e);
          // Update the score
          scoreUpdate(e.dataset.points);
          // Create new badguy
          badMaker();
          // Decrease BGCount
          BGcount--;
          // If BGcount is zero end the game
          if (BGcount < 0) {
            endGame();
          }
        }
      }

      if (mDown && isCollision(crossHair, e)) {
        // console.log("HIT");

        // Check if collision is with bomb
        //  if points are 0
        if (e.dataset.points == 0) {
          endGame();
          return;
        }

        // Remove clicked element
        e.parentNode.removeChild(e);

        // Create new element
        badMaker();
        BGcount--;

        scoreUpdate(e.dataset.points);

        if (BGcount < 0) {
          endGame();
        }

        //Don't continue to moving element
        return;
      }

      // get left position
      var x = parseInt(e.style.left);
      // get top position
      var y = parseInt(e.style.top);
      //get speed
      var sp = parseInt(e.dataset.speed);

      // Move element
      // check if mover hits zero
      if (e.dataset.mover <= 0) {
        //Moving speed of item
        e.dataset.speed = Math.ceil(Math.random() * 10) + 2;
        // Moving direction of item
        // e.dataset.dir = Math.ceil(Math.random() * 4);
        // move up, down, left, right and diagonally
        e.dataset.dir = Math.ceil(Math.random() * 8);
        // How many iterations it's gona move to the same direction
        e.dataset.mover = Math.ceil(Math.random() * 15) + 2;
      } else {
        // continue to move element to same diraction
        //decrease by one
        e.dataset.mover--;

        // Moving towards 4 directions (up, down, left, right)
        /*
        if (e.dataset.dir == "1" && x < myContainer.width) {
          //get the left position and increment by speed
          x += sp; //right
        }

        if (e.dataset.dir == "2" && x > 0) {
          //get the left position and decrement by speed
          x -= sp; //left
        }

        if (e.dataset.dir == "3" && y < myContainer.height) {
          //get the top position and increment by speed
          y += sp; //down
        }

        if (e.dataset.dir == "4" && y > 0) {
          //get the top position and decrement by speed
          y -= sp; //up
        }
        */

        // Moving towards 8 directions (up, down, left, right, diagonal)
        // If it's 1 go to righ, if it's 2 also go to the right, if it's 8
        if (
          (e.dataset.dir == "1" ||
            e.dataset.dir == "2" ||
            e.dataset.dir == "8") &&
          x < myContainer.width
        ) {
          //get the left position and increment by speed
          x += sp; //right
        }

        if (
          (e.dataset.dir == "4" ||
            e.dataset.dir == "5" ||
            e.dataset.dir == "6") &&
          x > 0
        ) {
          //get the left position and decrement by speed
          x -= sp; //left
        }

        // If it's 3 or 2 go to down
        if (
          (e.dataset.dir == "3" ||
            e.dataset.dir == "2" ||
            e.dataset.dir == "4") &&
          y < myContainer.height
        ) {
          //get the top position and increment by speed
          y += sp; //down
        }

        // 7 - moving up
        if (
          (e.dataset.dir == "7" ||
            e.dataset.dir == "6" ||
            e.dataset.dir == "8") &&
          y > 0
        ) {
          //get the top position and decrement by speed
          y -= sp; //up
        }
      }

      e.style.left = x + "px";
      e.style.top = y + "px";
    }

    function scoreUpdate(points) {
      score += parseInt(points);
      document.querySelector(".score").innerHTML = score;
    }

    function isCollision(a, b) {
      var aRect = a.getBoundingClientRect();
      var bRect = b.getBoundingClientRect();

      //  console.log(aRect);
      //  console.log(bRect);

      // console.log(aRect.top);
      // console.log(aRect.height);
      // console.log(aRect.left);
      // console.log(aRect.width);

      return !(
        aRect.top + aRect.height < bRect.top ||
        aRect.top > bRect.top + bRect.height ||
        aRect.left + aRect.width < bRect.left ||
        aRect.left > bRect.left + bRect.width
      );
    }

    function move(e) {
      document.querySelector(".crossInfo").innerHTML =
        "X:" + (e.clientX - 70) + "Y:" + (e.clientY - 50);

      // Log full event
      // console.log(e);

      // Log x coordinates
      // console.log(e.clientX);

      // Log y coordinates
      // console.log(e.clientY);

      // -100 because we set default size of element in CSS above
      crossHair.style.top = e.clientY - 100 + "px";

      // -140 because we set default size of element in CSS above (40) to set cursor on center
      crossHair.style.left = e.clientX - 140 + "px";
    }