let bgNpcCanvas;
let bgNpcCtx;
let bgBallCanvas;
let bgBallCtx;
let bricks = [];
let septum;

let ballPlate = {
    x: 0, y: 0, w: 80, h: 10
}

window.onload = () => {
    bgNpcCanvas = document.getElementById("bg-npc");
    bgNpcCtx = bgNpcCanvas.getContext("2d");
    bgNpcCtx.fillStyle = "rgba(150,221,255,0.7)";

    // bricks;
    for (let i = 0; i < Math.floor(bgNpcCanvas.width / 40); i++) {
        for (let j = 0; j < 15; j++) {
            bricks.push({
                x: i * 40, y: j * 20, w: 36, h: 16, ball: i % 2 !== 0
            });
        }
    }

    // ball plate
    ballPlate.y = bgNpcCanvas.height - 20;
    septum = {x: 0, y: 300, w: (Math.floor(bgNpcCanvas.width / 40) - 1) * 40 - 4, h: 10};

    bgBallCanvas = document.getElementById("bg-ball");
    bgBallCtx = bgBallCanvas.getContext("2d");
    bgBallCtx.fillStyle = "rgba(150,221,255,0.7)";
}

let balls = [{
    x: 950, y: 350, r: 4, dx: 0, dy: 4
}];

let ballAnimation = null;

function start(e) {
    e.hidden = true;

    window.addEventListener("mousedown", mousedown);
    window.addEventListener("mouseup", mouseup);

    drawBricks();
    drawSeptum();

    ballAnimation = window.requestAnimationFrame(drawBall);
}

function mousedown() {
    window.addEventListener("mousemove", mousemove);
}

function mouseup() {
    window.removeEventListener("mousemove", mousemove);
}

let lastOffsetX = ballPlate.x;

function mousemove(e) {
    bgNpcCtx.beginPath();
    bgNpcCtx.clearRect(0, ballPlate.y, bgNpcCanvas.width, ballPlate.h);

    lastOffsetX = ballPlate.x;
    ballPlate.x = e.offsetX - (ballPlate.w / 2);
    bgNpcCtx.fillRect(ballPlate.x, ballPlate.y, ballPlate.w, ballPlate.h);
}

function drawBricks() {
    bgNpcCtx.clearRect(0, 0, 1900, 300);
    for (let i = 0; i < bricks.length; i++) {
        bgNpcCtx.beginPath();
        bgNpcCtx.fillRect(bricks[i].x, bricks[i].y, bricks[i].w, bricks[i].h);
    }
}

function drawSeptum() {
    bgNpcCtx.clearRect(septum.x, septum.y, septum.w, septum.h);
    bgNpcCtx.save();
    bgNpcCtx.beginPath();
    bgNpcCtx.fillStyle = "rgba(150,221,255,0.65)";
    bgNpcCtx.fillRect(septum.x, septum.y, septum.w, septum.h);
    bgNpcCtx.restore();
}

function drawBall() {
    bgBallCtx.clearRect(0, 0, 1900, 935);

    balls = balls.filter(e => e.y <= bgBallCanvas.height);
    if (balls.length === 0) {
        alert("game over!");
        gameOver();
        return;
    }

    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];

        let brick = bricks.find(e => ball.x > e.x && ball.x < e.x + e.w && ball.y > e.y && ball.y < e.y + e.h);
        if (brick) {
            if (brick.ball) {
                balls.push({
                    x: brick.x, y: brick.y, r: 4, dx: 4, dy: 4
                });
            }

            bricks = bricks.filter(e => !(e.x === brick.x && e.y === brick.y));
            drawBricks();
            ball.dy = -ball.dy;
        }

        if ((ball.y + ball.dy) >= ballPlate.y && (ball.y + ball.dy) <= ballPlate.y + ballPlate.h && (ball.x + ball.dx) >= ballPlate.x && (ball.x + ball.dx) <= (ballPlate.x + ballPlate.w)) {
            let minus = 1;
            if (lastOffsetX < ballPlate.x) {
                minus = 1;
            } else {
                minus = -1;
            }
            let collisionPosition = Math.abs(ballPlate.x + (ballPlate.w / 2) - ball.x + ball.dx);
            if (collisionPosition >= 0 && collisionPosition < 10) {
                ball.dx = minus;
                ball.dy = -7;
            } else if (collisionPosition >= 10 && collisionPosition < 20) {
                ball.dx = 2 * minus;
                ball.dy = -6;
            } else if (collisionPosition >= 20 && collisionPosition < 30) {
                ball.dx = 3 * minus;
                ball.dy = -5;
            } else {
                ball.dx = 4 * minus;
                ball.dy = -4;
            }
        } else {
            if (ball.x + ball.dx >= Math.floor(bgNpcCanvas.width / 40) * 40 || ball.x + ball.dx < 0) {
                ball.dx = -ball.dx;
            }

            if (ball.y + ball.dy < ball.r) {
                ball.dy = -ball.dy;
            }

            let wCondition = ball.x + ball.dx >= 0 && ball.x + ball.dx <= septum.w;
            let hCondition = ball.y + ball.dy >= septum.y && ball.y + ball.dy <= septum.y + septum.h;
            if (wCondition && hCondition) {
                ball.dy = -ball.dy;
            }
        }

        ball.x += ball.dx;
        ball.y += ball.dy;
        bgBallCtx.beginPath();
        bgBallCtx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        bgBallCtx.fill();
    }

    window.requestAnimationFrame(drawBall);
}

function gameOver() {
    window.cancelAnimationFrame(ballAnimation);
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
    window.removeEventListener("mousedown", mousedown);
    // bgBallCtx.clearRect(0, 0, 1900, 935);
    // bgNpcCtx.clearRect(0, 0, 1900, 935);
    document.getElementById("start-game").hidden = false;
    balls = [{
        x: 950, y: 350, r: 4, dx: 0, dy: 4
    }];
    bricks = [];
    for (let i = 0; i < Math.floor(bgNpcCanvas.width / 40); i++) {
        for (let j = 0; j < 15; j++) {
            bricks.push({
                x: i * 40, y: j * 20, w: 36, h: 16, ball: i % 2 !== 0
            });
        }
    }
}