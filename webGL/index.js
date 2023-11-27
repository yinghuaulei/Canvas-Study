import {initBuffers} from "./init-buffers.js";
import {drawScene} from "./draw-scene.js";

let copyVideo = false;

function setupVideo(url) {
    const video = document.createElement("video");

    let playing = false;
    let timeupdate = false;

    video.playsInline = true;
    video.muted = true;
    video.loop = true;

    video.addEventListener("playing", () => {
        playing = true;
        checkReady();
    }, true);

    video.addEventListener("timeupdate", () => {
        timeupdate = true;
        checkReady();
    }, true);

    video.src = url;
    video.play().then(() => {
    });

    function checkReady() {
        if (playing && timeupdate) {
            copyVideo = true;
        }
    }

    return video;
}

window.onload = () => {
    // initialize the webGL context.
    const canvas = document.querySelector("#gl-canvas");
    const gl = canvas.getContext("webgl");

    // verify webGL support
    if (!gl) {
        alert("webGL cannot be initialized, and your browser, operating system, or hardware may not support webGL.");
        return;
    }

    // use completely opaque black to clear all images.
    gl.clearColor(0, 0, 0, 1.0);
    // clear the buffer with the color specified above.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoordinates;
        
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        varying highp vec2 vTextureCoordinates;
        
        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vTextureCoordinates = aTextureCoordinates;
        }
    `;

    const fsSource = `
        varying highp vec2 vTextureCoordinates;
        
        uniform sampler2D uSampler;
    
        void main() {
            gl_FragColor = texture2D(uSampler, vTextureCoordinates);
        }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = {
        program: shaderProgram, attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            textureCoordinates: gl.getAttribLocation(shaderProgram, "aTextureCoordinates")
        }, uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            uSampler: gl.getUniformLocation(shaderProgram, "uSampler")
        }
    }

    const buffers = initBuffers(gl);

    const texture = loadTexture(gl);
    const video = setupVideo("video.mp4");
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let then = 0;

    let cubeRotation = 0.0;

    function render(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        if (copyVideo) {
            updateTexture(gl, texture, video);
        }

        drawScene(gl, programInfo, buffers, texture, cubeRotation);
        cubeRotation += deltaTime;
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

/**
 * initialize shader program to let webGL know how to draw our data.
 * @param gl
 * @param vsSource
 * @param fsSource
 */
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // create shader program.
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // case creation fails.
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

/**
 * creates a shader of the specified type, uploads the source code and compiles it.
 */
function loadShader(gl, type, source) {
    // create a shader of the specified type.
    const shader = gl.createShader(type);

    // send the source to the shader object.
    gl.shaderSource(shader, source);

    // compile the shader program.
    gl.compileShader(shader);

    // see if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function loadTexture(gl) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalformat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const pixels = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalformat, width, height, border, format, type, pixels);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    return texture;
}

function updateTexture(gl, texture, video) {
    const level = 0;
    const internalformat = gl.RGBA;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalformat, format, type, video);
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}
