$(function () {
    window.requestAnimationFrame(draw);
});

function draw() {
    const ctx = document.getElementById('canvas').getContext('2d');

    ctx.globalCompositeOperation = "destination-over";
    ctx.clearRect(0, 0, 800, 800);
    ctx.save();

    ctx.translate(400, 400);
    ctx.strokeStyle = "rgba(246,246,246,0.2)";
    ctx.beginPath();
    ctx.arc(0, 0, 120, 0, Math.PI * 2);
    ctx.stroke();

    // Earth
    drawEarth(ctx);

    // Sun
    drawSun(ctx);

    ctx.restore();
    window.requestAnimationFrame(draw);
}

function drawSun(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    const radigrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
    radigrad.addColorStop(0, 'rgb(255,0,0)');
    radigrad.addColorStop(0.6, 'rgb(252,87,0)');
    radigrad.addColorStop(1, 'rgba(250,189,10, 0)');
    ctx.fillStyle = radigrad;
    ctx.fill();

    ctx.restore();
}

function drawEarth(ctx){
    ctx.save();
    const time = new Date();
    ctx.rotate(
        ((2 * Math.PI) / 60) * time.getSeconds() +
        ((2 * Math.PI) / 60000) * time.getMilliseconds(),
    );
    ctx.translate(120, 0);
    const radigrad = ctx.createRadialGradient(4, 4, 12, 8, 8, 1);
    radigrad.addColorStop(0, '#003577');
    radigrad.addColorStop(1, '#fff');
    ctx.fillStyle = radigrad;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();

    // Moon
    ctx.save();
    ctx.rotate(
        ((2 * Math.PI) / 6) * time.getSeconds() +
        ((2 * Math.PI) / 6000) * time.getMilliseconds(),
    );
    ctx.translate(0, 32);
    ctx.fillStyle = '#ddd';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
}