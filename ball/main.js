// ball
let raf;
let running = false;
let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');

const ball = {
    x: 100,
    y: 100,
    vx: 5,
    vy: 2,
    r: 20,
    color: '#ffffff',
    draw: () => {
        c.beginPath();
        c.fillStyle = ball.color;
        c.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
        c.fill();
    }
}

const tiles = {
    x: 100,
    r: 60,
    y: canvas.height - 20,
    lw: 5.5,
    color: '#fff',
    draw: () => {
        c.beginPath();
        c.strokeStyle = ball.color;
        c.lineWidth = 5.5;
        c.moveTo(tiles.x - tiles.r, tiles.y);
        c.lineTo(tiles.x + tiles.r, tiles.y);
        c.stroke();
    }
}

function clearBall() {
    c.fillStyle = 'rgba(0, 0, 0, 0.3)';
    c.clearRect(ball.x - ball.vx - ball.r - 1, ball.y - ball.vy - ball.r - 1, (ball.r + 1) * 2, (ball.r + 1) * 2);
}

function clearTiles() {
    c.fillStyle = 'rgba(0, 0, 0, 0.3)';
    c.clearRect(tiles.x - tiles.r, tiles.y - tiles.lw, tiles.r * 2, tiles.lw * 2);
}

function drawBall() {
    clearBall();
    ball.draw();

    if (ball.y >= (tiles.y - ball.r)
        && (ball.x + ball.vx) >= (tiles.x - tiles.r - ball.r)
        && (ball.x + ball.vx) <= (tiles.x + tiles.r + ball.r)) {
        ball.vy = -ball.vy;
        ball.vy *= 1.5;
        // speed up the ball.
        ball.vy += 0.01;
    } else if (ball.y + ball.vy > (canvas.height - ball.r)) {
        alert('Game over!');
        running = false;
        c.clearRect(0, 0, 1000, 600);
        window.cancelAnimationFrame(raf);
        return;
    }

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x + ball.vx > (canvas.width - ball.r) || ball.x + ball.vx < (0 + ball.r)) {
        ball.vx = -ball.vx;
    }

    if (ball.y + ball.vy < (0 + ball.r)) {
        ball.vy = -ball.vy;
    }

    raf = window.requestAnimationFrame(drawBall);
}

window.addEventListener("mousemove", (e) => {
    if (e.pageX >= innerWidth / 2 - 500 && e.pageX <= innerWidth / 2 + 500
        && e.pageY >= 10 && e.pageY <= 610 && running) {
        clearTiles();
        tiles.x = e.offsetX;
        tiles.draw();
    }
});

function start() {
    ball.x = 100;
    ball.y = 100;

    let s = 3;
    let interval = setInterval(() => {
        c.clearRect(0, 0, 1000, 600);
        if (s > 0) {
            c.save();
            c.translate(500, 300);
            c.font = '72px inter';
            c.beginPath();
            c.fillStyle = '#fff';
            c.fillText('' + s, 0, 0);
            c.restore();
            s -= 1;
        } else {
            clearInterval(interval);
            running = true;
            drawBall();
        }
    }, 1000);
}