$(function () {
    window.requestAnimationFrame(draw);
});

let stars = [];
for (let i = 0; i < 3000; i++) {
    stars.push({x: Math.random() * 800, y : Math.random() * 800});
}

function draw() {
    const ctx = document.getElementById('canvas').getContext('2d');

    ctx.globalCompositeOperation = "destination-over";
    ctx.clearRect(0, 0, 800, 800);
    ctx.save();

    ctx.translate(400, 400);
    ctx.strokeStyle = "rgba(246,246,246,0.2)";

    const time = new Date();
    let planetaryOrbits = [];

    // Sun
    drawSun(ctx);

    // Mercury
    planetaryOrbits.push(drawM(ctx, time));

    // Venus
    planetaryOrbits.push(drawV(ctx, time));

    // Earth
    planetaryOrbits.push(drawEarth(ctx, time));

    // Mars
    planetaryOrbits.push(drawMars(ctx, time));

    // Jupiter
    planetaryOrbits.push(drawJ(ctx, time));

    ctx.save();
    ctx.translate(-400, -400);
    let radius;
    for (let i = 0; i < stars.length; i++) {
        radius = 0.2;
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, radius, 0, Math.PI * 2);
        ctx.fill();

        stars[i].y -= 0.1;
        if (stars[i].y < 0){
            stars[i].y = 800;
        }
    }

    ctx.restore();

    for (let i = 0; i < planetaryOrbits.length; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, planetaryOrbits[i], 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();

    window.requestAnimationFrame(draw);
}

function drawM(ctx, time) {
    const radius = 50;

    ctx.save();

    ctx.rotate(
        ((20 * Math.PI) / 60) * time.getSeconds() +
        ((20 * Math.PI) / 60000) * time.getMilliseconds()
    );
    ctx.translate(0, radius);
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(118, 69, 29)';
    ctx.fill();

    ctx.restore();

    return radius;
}

function drawV(ctx, time) {
    const radius = 80;
    ctx.save();

    ctx.rotate(
        ((14 * Math.PI) / 60) * time.getSeconds() +
        ((14 * Math.PI) / 60000) * time.getMilliseconds()
    );
    ctx.translate(80, 0);
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    const radigrad = ctx.createRadialGradient(-4, 2, 10, 8, 0, 9);
    radigrad.addColorStop(0, 'rgb(255,247,173)');
    radigrad.addColorStop(1, 'rgb(89,83,45)');
    ctx.fillStyle = radigrad;
    ctx.fill();

    ctx.restore();

    return radius;
}

function drawEarth(ctx, time) {
    const radius = 120;
    ctx.save();
    ctx.rotate(
        ((8 * Math.PI) / 60) * time.getSeconds() +
        ((8 * Math.PI) / 60000) * time.getMilliseconds(),
    );
    ctx.translate(0, radius);
    const radigrad = ctx.createRadialGradient(0, -6, 12, 0, 6, 4);
    radigrad.addColorStop(0, 'rgb(111,173,255)');
    radigrad.addColorStop(1, 'rgb(0,59,128)');
    ctx.fillStyle = radigrad;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Moon
    ctx.save();
    ctx.rotate(
        ((6 * Math.PI) / 6) * time.getSeconds() +
        ((6 * Math.PI) / 6000) * time.getMilliseconds(),
    );
    ctx.translate(0, 18);
    ctx.fillStyle = '#ddd';
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();

    return radius;
}

function drawMars(ctx, time) {
    const radius = 160;
    ctx.save();

    ctx.rotate(
        (4 * Math.PI / 60) * time.getSeconds() +
        (4 * Math.PI / 60000) * time.getMilliseconds()
    );
    ctx.translate(radius, 0);
    const radigrad = ctx.createRadialGradient(0, 0, 5.5, 5.5, 0, 4.5);
    radigrad.addColorStop(0, 'rgb(255,19,0)');
    radigrad.addColorStop(1, 'rgb(141,42,33)');
    ctx.fillStyle = radigrad;
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    return radius;
}

function drawJ(ctx, time){
    const radius = 260;

    ctx.save();

    ctx.rotate(
        Math.PI * 2 / 60 * time.getSeconds() +
        Math.PI * 2 / 60000 * time.getMilliseconds()
    );
    ctx.translate(0, radius);
    const radigrad = ctx.createRadialGradient(0, -14, 28, 0, 14, 14);
    radigrad.addColorStop(0, 'rgb(255,194,148)');
    radigrad.addColorStop(1, 'rgb(136,73,28)');
    ctx.fillStyle = radigrad;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    return radius;
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