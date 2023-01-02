// Set up canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Set up bird
const bird = {
  x: 50,
  y: 250,
  width: 20,
  height: 20
};

// Set up pipes
let pipes = [
  { x: 300, y: 0, width: 50, height: 200 },
  { x: 600, y: 250, width: 50, height: 150 }
];

var score = 0;
var speed = 1;
let started = false;

// Draw bird on canvas
function drawBird() {
  ctx.fillStyle = "red";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Draw pipes on canvas
function drawPipes() {
  for (let pipe of pipes) {
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
  }
}

// Create the start screen
function renderStartScreen() {
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Flapper Square", canvas.width / 2, canvas.height / 2);
  ctx.fillText(
    "Press SPACE to flap the square",
    canvas.width / 2,
    canvas.height / 2 + 40
  );
  ctx.fillText(
    "Press R or TAP to start",
    canvas.width / 2,
    canvas.height / 2 + 80
  );
}

// Create the Game Over screen
function renderGameOver() {
  const maxScore = localStorage.getItem("maxScore");
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  ctx.fillText(
    `Your score was: ${score}`,
    canvas.width / 2,
    canvas.height / 2 + 40
  );
  ctx.fillText(
    `Your max score is: ${score > maxScore ? score : maxScore}`,
    canvas.width / 2,
    canvas.height / 2 + 80
  );
  ctx.fillText(
    "Press R or TAP to restart",
    canvas.width / 2,
    canvas.height / 2 + 120
  );
  if (score > maxScore) {
    localStorage.setItem("maxScore", score);
  }
  setTimeout(() => {
    started = false;
  }, 1500);
}

// Render the score
function renderScore() {
  ctx.font = "16px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 40, 25);
}

function addScore() {
  score++;
}

// Update game state
function update() {
  // Move pipes to the left
  for (let pipe of pipes) {
    pipe.x -= speed;
  }

  // If a pipe has moved off the screen, remove it
  if (pipes[0].x < -50) {
    pipes.shift();
    addScore();
  }

  // Add a new pipe if necessary
  if (pipes[pipes.length - 1].x < 750) {
    pipes.push({
      x: 1000,
      y: Math.random() * 500,
      width: 50,
      height: Math.random < 0.5 ? 150 : 200
    });
  }

  bird.y += 1;
  speed += 0.00015;
  renderScore();
}

// Check for collision between bird and pipes
function checkCollision() {
  for (let pipe of pipes) {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      bird.y + bird.height > pipe.y &&
      bird.y < pipe.y + pipe.height
    ) {
      // Collision detected!
      return true;
    } else if (bird.y >= 680 || bird.y <= 0) {
      return true;
    } else {
      return false;
    }
  }
}

function resetGame() {
  score = 0;
  speed = 1;
  pipes = [
    { x: 300, y: 0, width: 50, height: 200 },
    { x: 600, y: 250, width: 50, height: 150 }
  ];
  bird.x = 50;
  bird.y = 250;
}

// Main game loop
function loop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update game state
  update();

  // Draw bird and pipes
  drawBird();
  drawPipes();

  // Check for collision
  const collision = checkCollision();
  if (collision) {
    renderGameOver();
    return;
  }

  // Request another frame
  requestAnimationFrame(loop);
}

// Start game
renderStartScreen();

document.addEventListener("keydown", function (event) {
  // Handle space bar press (bird flap)
  if (event.code === "Space") {
    bird.y -= 50;
  }
  // Push r to restart
  if (event.code === "KeyR") {
    resetGame();
    // Start game loop
    loop();
  }
});

document.addEventListener("touchstart", () => {
  if (!started) {
    started = true;
    resetGame();
    loop();
  }
  bird.y -= 50;
});
