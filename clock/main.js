$(function () {
    window.requestAnimationFrame(clock);
});

function clock() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.save();

    ctx.clearRect(0, 0, 600, 600);
    ctx.translate(300, 300);

    ctx.save();
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.rotate(Math.PI * 2 - Math.PI / 2);

    for (let i = 0; i < 60; i++) {
        ctx.save();
        ctx.rotate(((Math.PI * 2) / 60) * i);
        ctx.translate(0, -100);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        if (i % 5 === 0) {
            ctx.lineWidth = 3.5;
            ctx.lineTo(0, 8);
            ctx.stroke();
        } else {
            ctx.lineWidth = 1.5;
            ctx.lineTo(0, 5);
            ctx.stroke();
        }
        ctx.restore();
    }

    let date = new Date();
    const h = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    ctx.lineCap = 'round';

    ctx.save();
    ctx.rotate(
        Math.PI / 6 * h + Math.PI / 360 * min + Math.PI / 21600 * sec
    );
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#222';
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(48, 0);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(
        Math.PI / 30 * min + Math.PI / 1800 * sec
    );
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#0055bb';
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(60, 0);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(
        Math.PI * 2 / 60 * sec
    );
    ctx.lineCap = '';
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgb(145,0,0)';
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(72, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(75, 0, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    window.requestAnimationFrame(clock);
}