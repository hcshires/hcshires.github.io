const canvas = document.getElementById("brickmash");
const ctx = canvas.getContext("2d");

ctx.canvas.width = canvas.clientWidth;
ctx.canvas.height = window.innerHeight;

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;
let paddleHeight = 10;
let paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 14;
let brickColumnCount = 14;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;

let bricks = [];
for (c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}

const wrongSound = new Audio("./sounds/wrong.mp3");
const youLose = new Audio("./sounds/sadtrombone.mp3");
const shotgun = new Audio("./sounds/gun.mp3");
const atomic = new Audio("./sounds/bomb.mp3");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	} else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

function mouseMoveHandler(e) {
	let relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

function collisionDetection() {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			let b = bricks[c][r];
			if (b.status == 1) {
				if (
					x > b.x &&
					x < b.x + brickWidth &&
					y > b.y &&
					y < b.y + brickHeight
				) {
					dy = -dy;
					b.status = 0;
					let nShotgun = shotgun.cloneNode();
					nShotgun.play();
					score++;
					if (score == brickRowCount * brickColumnCount) {
						atomic.play();
						alert("YOU WIN!");
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "#FFA500";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#FFA500";
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
				let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#FFA500";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#FFA500";
	ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#FFA500";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius) {
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			wrongSound.play();
			lives--;
			if (!lives) {
				youLose.play();
				alert("GAME OVER");
				document.location.reload();
			} else {
				x = canvas.width / 2;
				y = canvas.height - 30;
				dx = dx;
				dy = -dy;
			}
		}
	}
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 10;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= 10;
	}

	x += dx;
	y += dy;
	requestAnimationFrame(draw);
}

draw();
