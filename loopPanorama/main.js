$(() => {
    let img = new Image();
    img.src = 'panorama.jpg';

    let canvasXSize = 500;
    let canvasYSize = 500;

    let speed = 10;
    let y = -4.5;

    // main program.
    let dx = 0.75;
    let imgW;
    let imgH;
    let x = 0;
    let clearX;
    let clearY;

    let ctx;

    img.onload = () => {
        imgW = img.width;
        imgH = img.height;

        if (imgW > canvasXSize) {
            x = canvasXSize - imgW;
            clearX = imgW;
        } else {
            clearX = canvasXSize;
        }

        if (imgH > canvasYSize) {
            clearY = imgH;
        } else {
            clearY = canvasYSize;
        }

        ctx = document.getElementById('canvas').getContext('2d');

        return setInterval(() => {
            ctx.clearRect(0, 0, clearX, clearY);

            if (imgW <= canvasXSize) {
                // reset, start for beginning.
                if (x > canvasXSize) {
                    x -= imgW;
                }

                if (x > 0) {
                    ctx.drawImage(img, x - imgW, y, imgW, imgH);
                }

                if (x - imgW > 0) {
                    ctx.drawImage(img, x - imgW * 2, y, imgW, imgH);
                }
            } else {
                if (x > canvasXSize) {
                    x = canvasXSize - imgW;
                }

                if (x > canvasXSize - imgW) {
                    ctx.drawImage(img, x - imgW + 1, y, imgW, imgH);
                }
            }

            // draw image
            ctx.drawImage(img, x, y, imgW, imgH);
            x += dx;
        }, speed);
    }
});