let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let count = 0;
let score = 0;
let highScore = 0;

// sounds
const appleEatingSound = new Audio("sounds/sound.mp3");
const hundredReachedSound = new Audio("sounds/hundred.mp3");
const fiveHundredSound = new Audio("sounds/fiveHundred.mp3");

//random number function
const randomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// colors array
const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
      '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
      '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
      '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
      '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
      '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
      '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
      '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

//snake object
let snake = {
	x: 100,
	y: 100,

	//velocity
	dx: 10,
	dy: 0,

	cells: [],
	cellsLength: 4
}

//apple object
let apple = {
	x: 250,
	y: 250
}

let loop = function() {
	requestAnimationFrame(loop);

  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;
  
  // score and high score labels
  context.font = "20px Georgia";
  context.fillStyle = "White";
  context.fillText("Score: " + score, 10, 20);
  //sizing highScore label
  if (highScore >= 100) {
    context.fillText("High Score: " + highScore, 355, 20);
  } else if (highScore >= 10 && highScore < 100) {
    context.fillText("High Score: " + highScore, 365, 20);
  } else {
    context.fillText("High Score: " + highScore, 375, 20)
  }

  // continue movement from the other horizontal edge
  if (snake.x < 0) {
    snake.x = canvas.width - 10;
    canvas.style.border = "5px solid " + colorArray[randomNumber(0, 49)];;
    }

  else if (snake.x >= canvas.width) {
    snake.x = 0;
    canvas.style.border = "5px solid " + colorArray[randomNumber(0, 49)];;
  }
  
  // continue movement from the other vertical edge
  if (snake.y < 0) {
    snake.y = canvas.height - 10;
    canvas.style.border = "5px solid " + colorArray[randomNumber(0, 49)];;
  }

  else if (snake.y >= canvas.height) {
    snake.y = 0;
    canvas.style.border = "5px solid " + colorArray[randomNumber(0, 49)];;
  }
  
  // prepending to the cells array 
  snake.cells.unshift({x: snake.x, y: snake.y});
  
  // remove cells as we move away from them
  if (snake.cells.length > snake.cellsLength) {
    snake.cells.pop();
  }
  
  // draw apple
  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, 10, 10);
  
  // draw snake one cell at a time
  context.fillStyle = "green";
  snake.cells.forEach(function(cell, index) {
    
    context.fillRect(cell.x, cell.y, 10, 10);  
    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      appleEatingSound.play();

      snake.cellsLength++;
      score++;

      if (score === 100) {
        hundredReachedSound.play();
        document.body.style.backgroundColor = "orange";
      } else if (score === 500) {
        fiveHundredSound.play();
        document.body.style.backgroundColor = "darkblue";
      } else if (score === 0) {
        document.body.style.backgroundColor = "black";
      }
      
      apple.x = randomNumber(1, 49) * 10;
      apple.y = randomNumber(2, 49) * 10;
    }
    // checking collision
    for (let i = index + 1; i < snake.cells.length; i++) {
      
      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        
        // position
        snake.x = 160;
        snake.y = 160;
        
        // cells
        snake.cells = [];
        snake.cellsLength = 4;
        
        // velocity
        snake.dx = 10;
        snake.dy = 0;
        
        // new apple's position
        apple.x = randomNumber(1, 49) * 10;
        apple.y = randomNumber(2, 49) * 10;

        // stating the high score
        if (highScore < score) {
          highScore = score
        } 

        //resseting the score after a collision
        score = 0;

        alert("Game Over")
      }
    }
  });
}

// keys 
const leftKey = 37;
const upKey = 38;
const rightKey = 39;
const downKey = 40;

// snake movement
document.addEventListener('keydown', function(event) {
  
  if(event.keyCode === upKey) {
      // if snake moves downward, prevent returning up and colliding with body
      if (snake.dy === 10 && snake.dx === 0) {
        snake.dy = snake.dy;
        snake.dx = snake.dx;
      } else {
        snake.dy = -10;
        snake.dx = 0;
      }

    } else if (event.keyCode === leftKey) {
      // if snake moves right, prevent returning left and colliding with body
      if (snake.dx === 10 && snake.dy === 0) {
        snake.dx = snake.dx;
        snake.dy = snake.dy;
      } else {
        snake.dx = -10;
        snake.dy = 0;
      }

    } else if (event.keyCode === rightKey) {
      // if snake moves left, prevent returning right and colliding with body
      if (snake.dx === -10 && snake.dy === 0) {
        snake.dx = snake.dx;
        snake.dy = snake.dy;
      } else {
        snake.dx = 10;
        snake.dy = 0;
      }

    } else if (event.keyCode === downKey) {
      // if snake moves upward, prevent returning down and colliding with body
      if (snake.dy === -10 && snake.dx === 0) {
        snake.dy = snake.dy;
        snake.dx = snake.dx;
      } else {
        snake.dy = 10;
        snake.dx = 0;
      }

    }
}, false);

requestAnimationFrame(loop);