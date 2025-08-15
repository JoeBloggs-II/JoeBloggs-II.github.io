const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game constants
const PADDLE_WIDTH = 12, PADDLE_HEIGHT = 90;
const BALL_SIZE = 16;
const PLAYER_X = 20, AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 7;
const BALL_SPEED = 6;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

// Keyboard control state
let upPressed = false;
let downPressed = false;

// Mouse control for player paddle
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp paddle within bounds
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Keyboard controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
});

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Center line
  ctx.strokeStyle = "#888";
  ctx.setLineDash([16, 16]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillStyle = "#0ff";
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Simple AI to move paddle toward ball
function updateAI() {
  const aiCenter = aiY + PADDLE_HEIGHT / 2;
  const ballCenter = ballY + BALL_SIZE / 2;
  if (aiCenter < ballCenter - 10) aiY += PADDLE_SPEED;
  else if (aiCenter > ballCenter + 10) aiY -= PADDLE_SPEED;
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Ball movement and collision
function updateBall() {
  ballX += ballVX;
  ballY += ballVY;

  // Top/bottom wall collision
  if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
    ballVY = -ballVY;
    ballY = Math.max(0, Math.min(canvas.height - BALL_SIZE, ballY));
  }

  // Left paddle collision
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= playerY &&
    ballY <= playerY + PADDLE_HEIGHT
  ) {
    ballVX = Math.abs(ballVX);
    // Add spin based on where hit
    let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    ballVY += hitPos * 0.15;
  }

  // Right paddle collision
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE >= aiY &&
    ballY <= aiY + PADDLE_HEIGHT
  ) {
    ballVX = -Math.abs(ballVX);
    let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    ballVY += hitPos * 0.15;
  }

  // Left/right wall: reset ball
  if (ballX < 0 || ballX + BALL_SIZE > canvas.width) {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    ballVY = BALL_SPEED * (Math.random() * 2 - 1);
  }
}

// Update paddle with keyboard
function updatePlayerPaddleKeyboard() {
  if (upPressed) {
    playerY -= PADDLE_SPEED;
  }
  if (downPressed) {
    playerY += PADDLE_SPEED;
  }
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
}

// Main game loop
function loop() {
  updatePlayerPaddleKeyboard();
  updateAI();
  updateBall();
  draw();
  requestAnimationFrame(loop);
}

loop();
