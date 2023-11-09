const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

let img = new Image();
img.crossOrigin = 'anonymous';
img.src = '../image/demoImage.jpg';

img.onload = () => {
    c.drawImage(img, 0, 0, 200, 200);
    invert();
}

// const hoveredColor = document.getElementById('hoveredColor');
// const selectedColor = document.getElementById('selectedColor');

// window.addEventListener('mousemove', (e) => {
//     picker(e, hoveredColor);
// });
//
// window.addEventListener('click', (e) => {
//     picker(e, selectedColor);
// });
//
// function picker(e, destination) {
//     let pixel = c.getImageData(e.offsetX, e.offsetY, 1, 1);
//     let data = pixel.data;
//
//     const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]/255})`;
//
//     destination.style.color = rgba;
//     destination.textContent = rgba;
// }

const invert = () => {
    c.drawImage(img, 0, 0, 200, 200);
    const imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i++) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    c.putImageData(imageData, 0, 0);
}