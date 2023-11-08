let canvas;
let ctx;
let a = [];
const m = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

window.onmousemove = (e) => {
    m.x = e.clientX;
    m.y = e.clientY;
};

function gc() {
    let s = '0123456789abcdef';
    let c = '#';
    for (let i = 0; i < 6; i++) {
        c += s[Math.ceil(Math.random() * 15)];
    }
    return c;
}

$(() => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    for (let i = 0; i < 10; i++) {
        a.push(new ob(
        innerWidth / 2,
            innerHeight / 2,
            5,
            gc(),
            Math.random() * 200 + 20,
            2));
    }

    ctx.lineWidth = '2';
    ctx.globalAlpha = 0.5;
    resize();
    anim();
})

window.onresize = () => {
    resize();
};

function resize() {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    for (let i = 0; i < 101; i++) {
        a[i] = new ob(
        innerWidth / 2,
            innerHeight / 2,
            4,
            gc(),
            Math.random() * 200 + 20,
            0.02
        );
    }
}

function ob(x, y, r, cc, o, s) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.cc = cc;
    this.theta = Math.random() * Math.PI * 2;
    this.s = s;
    this.t = Math.random() * 150;

    this.dr = () => {
        const ls = {
            x: this.x,
            y: this.y
        };

        this.theta += this.s;
        this.x = m.x + Math.cos(this.theta) * this.t;
        this.y = m.y + Math.sin(this.theta) * this.t;

        ctx.beginPath();
        ctx.lineWidth = this.r;
        ctx.strokeStyle = this.cc;
        ctx.moveTo(ls.x, ls.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.closePath();
    }
}

function anim() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    a.forEach((e) => {
        e.dr();
    });
    requestAnimationFrame(anim);
}