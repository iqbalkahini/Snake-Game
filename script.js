const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const timer = document.getElementById("timer");
const skor = document.getElementById("skor");
const btnRewind = document.querySelector(".btn-rewind");
const rewind = document.querySelector(".rewind");
const btnCancel = document.getElementById("btn-cancel");
const btnRewindActive = document.getElementById("btn-rewind");
const sleder = document.getElementById("sleder");

canvas.width = 960;
canvas.height = 600;

// alur rewind
btnRewind.addEventListener("click", (e) => {
  rewind.style.display = "";
  sleder.style.display = "";
  e.target.style.display = "none";
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  clearInterval(aInterval);
  clearInterval(bInterval);
  clearInterval(cInterval);
});
btnCancel.addEventListener("click", (e) => {
  rewind.style.display = "none";
  sleder.style.display = "none";
  btnRewind.style.display = "";
  snake = history[history.length - 1][0];
  food = history[history.length - 1][1];
  detik = history[history.length - 1][2];
  menit = history[history.length - 1][3];
  gas();
  sleder.value = 4;
});
sleder.addEventListener("input", (e) => {
  snake = history[e.target.value][0];
  food = history[e.target.value][1];
  detik = history[e.target.value][2];
  menit = history[e.target.value][3];
  draw();
  timer.textContent = `${jam}:${menit.toString().padStart(2, 0)};${detik
    .toString()
    .padStart(2, 0)}`;
});
btnRewindActive.addEventListener("click", (e) => {
  rewind.style.display = "none";
  sleder.style.display = "none";
  btnRewind.style.display = "";
  start();
});

// inisialisasi
const cell = 20;
const kotakX = 48;
const kotakY = 30;

let snake = [
  { x: 24, y: 15 },
  { x: 23, y: 15 },
  { x: 22, y: 15 },
  { x: 21, y: 15 },
  { x: 20, y: 15 },
  { x: 19, y: 15 },
];
let food = [
  { x: Math.floor(Math.random() * 48), y: Math.floor(Math.random() * 30) },
  { x: Math.floor(Math.random() * 48), y: Math.floor(Math.random() * 30) },
  { x: Math.floor(Math.random() * 48), y: Math.floor(Math.random() * 30) },
];
let history = [];
let direction = "right";
let skorValue = 6;
let gameInterval;
let timerInterval;
let aInterval;
let bInterval;
let cInterval;
let jam = 0;
let menit = 0;
let detik = 0;

function draw() {
  for (let index = 0; index < kotakY; index++) {
    for (let i = 0; i < kotakX; i++) {
      if ((index + i) % 2 == 0) {
        ctx.fillStyle = "black";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fillRect(i * cell, index * cell, cell, cell);
    }
  }

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = "red";
    ctx.fillRect(snake[i].x * cell, snake[i].y * cell, cell, cell);
  }

  for (let index = 0; index < food.length; index++) {
    ctx.fillStyle = "green";
    ctx.fillRect(food[index].x * cell, food[index].y * cell, cell, cell);
  }
}

function move() {
  let head = { x: snake[0].x, y: snake[0].y };

  if (direction == "right") head.x += 1;
  if (direction == "top") head.y -= 1;
  if (direction == "left") head.x -= 1;
  if (direction == "bottom") head.y += 1;

  if (head.x == 48) head.x = 0;
  if (head.x < 0) head.x = 48;
  if (head.y == 30) head.y = 0;
  if (head.y < 0) head.y = 30;

  const eat = food.some((f) => f.x == head.x && f.y == head.y);

  if (eat) {
    food = food.filter((f) => f.x !== head.x && f.y !== head.y);
    snake.unshift(head);
    skorValue++;
    skor.textContent = skorValue;
    return;
  }

  if (snake.some((s) => s.x == head.x && s.y == head.y)) {
    alert("Game Berakhir anda meiliki skor " + skorValue);
    location.reload();
  }

  snake.unshift(head);
  snake.pop();
}

document.addEventListener("keydown", (e) => {
  if (e.key == "w" && direction !== "bottom") direction = "top";
  if (e.key == "d" && direction !== "left") direction = "right";
  if (e.key == "a" && direction !== "right") direction = "left";
  if (e.key == "s" && direction !== "top") direction = "bottom";
});

function game() {
  gameInterval = setInterval(() => {
    move();
    draw();
  }, 100);
}

function start() {
  timerInterval = setInterval(() => {
    detik++;
    if (detik == 60) {
      detik = 0;
      menit++;
    }
    if (menit == 60) {
      menit = 0;
      jam++;
    }

    timer.textContent = `${jam}:${menit.toString().padStart(2, 0)};${detik
      .toString()
      .padStart(2, 0)}`;

    history.push([
      JSON.parse(JSON.stringify(snake)),
      JSON.parse(JSON.stringify(food)),
      detik,
      menit,
    ]);
    if (history.length == 6) history.shift();
  }, 1000);
  game();
}

function gas() {
  aInterval = setInterval(() => {
    if (food.length >= 3 && food.length < 5) {
      food.unshift({
        x: Math.floor(Math.random() * 48),
        y: Math.floor(Math.random() * 30),
      });
    }
  }, 3000);
  bInterval = setInterval(() => {
    if (food.length <= 5 && food.length > 3) {
      food.pop();
    }
  }, 5000);
  cInterval = setInterval(() => {
    if (food.length < 3) {
      food.unshift({
        x: Math.floor(Math.random() * 48),
        y: Math.floor(Math.random() * 30),
      });
    }
  }, 10);
  start();
}

gas();
