const board = document.querySelector(".board");
const startBtn = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")

const blockHt = 50;
const blockWd = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0
let time = `00:00`

highScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockWd);
const rows = Math.floor(board.clientHeight / blockHt);

const blocks = [];
let snake = [{ x: 1, y: 3 }];

let intervalId = null;
let timerIntervalId = null; 

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let direction = "down";

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText = `${r},${c}`;
    blocks[`${r},${c}`] = block;
  }
}

function render() {
  let head = null;

  blocks[`${food.x},${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    // alert("Opps!!! Khel khtm!!!")
    clearInterval(intervalId);

    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";

    return;
  }

  if(head.x == food.x && head.y == food.y){
      blocks[`${food.x},${food.y}`].classList.remove("food");
      food = {x : Math.floor(Math.random()*rows) , y : Math.floor(Math.random()*cols)};
      blocks[`${food.x},${food.y}`].classList.add("food");
      snake.unshift(head);

      score += 10;
      scoreElement.innerText = score;

      if(score > highScore){
        highScore = score;
        localStorage.setItem("highScore", highScore.toString());
      }

  }

  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.add("fill");
  });
}

startBtn.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);
  timerIntervalId = setInterval(() => {
    let [min,sec] = time.split(":").map(Number);
    if(sec == 59){
      min += 1
      sec = 0;
    }
    else{
      sec += 1;
    }
    time = `${min}:${sec}`
    timeElement.innerText = time;
  },1000)
});

restartButton.addEventListener("click", restartGame);

function restartGame() {

  blocks[`${food.x},${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.remove("fill");
  });

  score = 0;
  time = `00:00`

  scoreElement.innerText = score
  timeElement.innerText = time
  highScoreElement.innerText = highScore


  modal.style.display = "none";
  direction = "down";
  snake = [{ x: 1, y: 3 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  intervalId = setInterval(() => {
    render();
  }, 300);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") direction = "up";
  else if (event.key === "ArrowDown") direction = "down";
  else if (event.key === "ArrowLeft") direction = "left";
  else if (event.key === "ArrowRight") direction = "right";
});

let touchStartX = 0;
let touchStartY = 0;

window.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

window.addEventListener("touchend", (e) => {
  let touchEndX = e.changedTouches[0].clientX;
  let touchEndY = e.changedTouches[0].clientY;

  let dx = touchEndX - touchStartX;
  let dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal swipe
    if (dx > 0) direction = "right";
    else direction = "left";
  } else {
    // Vertical swipe
    if (dy > 0) direction = "down";
    else direction = "up";
  }
});