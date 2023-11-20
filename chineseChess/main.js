const CONST_OBJ = {
    cs: 0, ls: 0, bw: 0, bh: 0, bx: 0, by: 0, speed: 7, cs1: function () {
        return this.cs * 2;
    }, cs2: function () {
        return this.cs * 3;
    }, cs3: function () {
        return this.cs * 4;
    }, cs4: function () {
        return this.cs * 5;
    }, ls1: function () {
        return this.ls * 2;
    }, ls2: function () {
        return this.ls * 3;
    }, ls3: function () {
        return this.ls * 4;
    }
}

const colCount = 9;
const lineCount = 8;

// chess piece list.
let chessPieceList;
let actor = "R";
let animation;
let inAnimation;
let canPlaced = [];
let confirmPlaced;
let ccGameCtx;
let deadPieceList = [];
let isCheckmate = false;
let gameOver = false;

let ccUiCtx;
let ccUiAnimation;
let uiStartY, uiText, uiTimeOut;

function reStart() {
    deadPieceList = [];
    isCheckmate = false;
    gameOver = false;
    chessPieceList = [];
    for (let i = 0; i < initChessPieceList.length; i++) {
        chessPieceList.push(JSON.parse(JSON.stringify(initChessPieceList[i])));
    }

    for (let i = 0; i <chessPieceList.length; i++) {
        let ele = chessPieceList[i];
        ele.click = (c) => {
            drawChessPieceList(c, chessPieceList);

            let activeEle = chessPieceList.find(e => e.active === true && e.name !== ele.name);
            if (activeEle) {
                activeEle.active = false;
            }

            if (!ele.active) {
                getCanPlaced(ele);
                for (let j = 0; j < canPlaced.length; j++) {
                    c.save();
                    c.beginPath();
                    c.fillStyle = 'rgba(83,222,248,0.9)';
                    c.arc(canPlaced[j].x, canPlaced[j].y, 7, 0, Math.PI * 2);
                    c.fill();
                    c.restore();
                }
            }
            ele.active = !ele.active;
        }
        ele.draw = (c) => {
            drawChessPiece(c, ele);
        }
    }

    drawChessPieceList(ccGameCtx, chessPieceList);

    actor = "R";
    $("#cc_actor").text(actor === "R" ? "红棋" : "黑棋");
}

$(() => {
    const ccBackgroundCanvas = document.getElementById("cc_background");
    const ccBKCtx = ccBackgroundCanvas.getContext("2d");


    drawCheckerboard(ccBKCtx, ccBackgroundCanvas.width, ccBackgroundCanvas.height);

    const ccGameCanvas = document.getElementById("cc_game");
    ccGameCtx = ccGameCanvas.getContext("2d");
    ccGameCtx.translate(CONST_OBJ.bx, CONST_OBJ.by);

    reStart();

    const ccUiCanvas = document.getElementById("cc_ui");
    ccUiCtx = ccUiCanvas.getContext("2d");
    ccUiCtx.translate(CONST_OBJ.bx, CONST_OBJ.by);

    window.addEventListener("click", (e) => {
        if (!inAnimation) {
            let x = e.offsetX - CONST_OBJ.bx;
            let y = e.offsetY - CONST_OBJ.by
            const element = chessPieceList.find(ele => x >= ele.x - ele.r && x <= ele.x + ele.r && y >= ele.y - ele.r && y <= ele.y + ele.r);
            if (element && element.click && element.factions === actor) element.click(ccGameCtx);

            confirmPlaced = canPlaced.find(ele => x >= ele.x - ele.r && x <= ele.x + ele.r && y >= ele.y - ele.r && y <= ele.y + ele.r);
            if (confirmPlaced) {
                animation = window.requestAnimationFrame(offsetChessPiece);
                inAnimation = true;
            }
        }
    });
});

/**
 * draw chess piece.
 * @param c
 * @param list
 */
function drawChessPieceList(c, list) {
    canPlaced = [];
    c.clearRect(-30, -30, 460, 560);
    for (let i = 0; i < list.length; i++) {
        if (list[i].draw) {
            list[i].draw(ccGameCtx);
        }
    }
}

function drawCheckerboard(c, canvasWidth, canvasHeight) {
    CONST_OBJ.bw = canvasWidth * 0.8;
    CONST_OBJ.bh = canvasHeight * 0.75;

    CONST_OBJ.bx = canvasWidth / 2 - CONST_OBJ.bw / 2;
    CONST_OBJ.by = canvasHeight / 2 - CONST_OBJ.bh / 2;

    c.save();
    c.translate(CONST_OBJ.bx, CONST_OBJ.by);

    CONST_OBJ.cs = CONST_OBJ.bh / colCount;
    CONST_OBJ.ls = CONST_OBJ.bw / lineCount;

    // set initial coordinate.
    for (let i = 0; i < (lineCount + 1); i++) {
        for (let j = 0; j < (colCount + 1); j++) {
            let obj = initChessPieceList.find(chessPiece => chessPiece.unitX === i && chessPiece.unitY === j);
            if (obj) {
                obj.x = CONST_OBJ.ls * i;
                obj.y = CONST_OBJ.cs * j;

                // draw the outline of the "P"
                if (obj.type === "P") {
                    c.save();
                    c.lineWidth = 1.5;

                    c.beginPath();
                    c.moveTo(obj.x - 10, obj.y - 4);
                    c.lineTo(obj.x - 4, obj.y - 4);
                    c.lineTo(obj.x - 4, obj.y - 10);
                    c.stroke();

                    c.beginPath();
                    c.moveTo(obj.x - 10, obj.y + 4);
                    c.lineTo(obj.x - 4, obj.y + 4);
                    c.lineTo(obj.x - 4, obj.y + 10);
                    c.stroke();

                    c.beginPath();
                    c.moveTo(obj.x + 10, obj.y + 4);
                    c.lineTo(obj.x + 4, obj.y + 4);
                    c.lineTo(obj.x + 4, obj.y + 10);
                    c.stroke();

                    c.beginPath();
                    c.moveTo(obj.x + 10, obj.y - 4);
                    c.lineTo(obj.x + 4, obj.y - 4);
                    c.lineTo(obj.x + 4, obj.y - 10);
                    c.stroke();
                    c.restore();
                }

                // draw the outline of the "S"
                if (obj.type === "S") {
                    c.save();
                    c.beginPath();
                    c.moveTo(obj.x, obj.y);
                    let lineToX, lineToY;
                    if (obj.name.indexOf("bL") !== -1) {
                        lineToX = obj.x + CONST_OBJ.ls1();
                        lineToY = obj.y + CONST_OBJ.cs1();
                    } else if (obj.name.indexOf("bR") !== -1) {
                        lineToX = obj.x - CONST_OBJ.ls1();
                        lineToY = obj.y + CONST_OBJ.cs1();
                    } else if (obj.name.indexOf("rL") !== -1) {
                        lineToX = obj.x + CONST_OBJ.ls1();
                        lineToY = obj.y - CONST_OBJ.cs1();
                    } else {
                        lineToX = obj.x - CONST_OBJ.ls1();
                        lineToY = obj.y - CONST_OBJ.cs1();
                    }

                    c.lineTo(lineToX, lineToY);
                    c.stroke();
                    c.restore();
                }
            }
        }
    }

    c.save();
    c.lineWidth = 1.5;
    c.beginPath();
    c.strokeRect(0, 0, CONST_OBJ.bw, CONST_OBJ.bh);
    c.restore();

    c.save();
    c.lineWidth = 1.5;
    for (let i = 0; i < colCount; i++) {
        if (i === 5) {
            c.save();
            c.font = "32px 隶书";
            c.textBaseline = "middle";
            c.textAlign = "center";
            c.beginPath();
            c.fillText("楚河         汉界", CONST_OBJ.ls3(), CONST_OBJ.cs3() + (CONST_OBJ.cs / 2));
            c.restore();
        }

        c.beginPath();
        c.moveTo(0, CONST_OBJ.bh / colCount * i);
        c.lineTo(CONST_OBJ.bw, CONST_OBJ.bh / colCount * i);
        c.stroke();
    }
    for (let i = 0; i < lineCount; i++) {
        c.beginPath();
        c.moveTo(CONST_OBJ.bw / lineCount * i, 0);
        c.lineTo(CONST_OBJ.bw / lineCount * i, CONST_OBJ.cs3());
        c.stroke();

        c.beginPath();
        c.moveTo(CONST_OBJ.bw / lineCount * i, CONST_OBJ.cs4());
        c.lineTo(CONST_OBJ.bw / lineCount * i, CONST_OBJ.bh);
        c.stroke();
    }

    c.restore();

    c.restore();
}

function offsetChessPiece() {
    // get active chess piece
    let ocp = chessPieceList.find(ele => ele.active === true);
    if (ocp) {
        let stop = false;
        switch (confirmPlaced.direction) {
            case "top" :
                ocp.y -= CONST_OBJ.speed;
                if (ocp.y <= confirmPlaced.y) {
                    ocp.y = confirmPlaced.y;
                    stop = true;
                }
                break;
            case "down":
                ocp.y += CONST_OBJ.speed;
                if (ocp.y >= confirmPlaced.y) {
                    ocp.y = confirmPlaced.y;
                    stop = true;
                }
                break;
            case "left":
                ocp.x -= CONST_OBJ.speed;
                if (ocp.x <= confirmPlaced.x) {
                    ocp.x = confirmPlaced.x;
                    stop = true;
                }
                break;
            case "right":
                ocp.x += CONST_OBJ.speed;
                if (ocp.x >= confirmPlaced.x) {
                    ocp.x = confirmPlaced.x;
                    stop = true;
                }
                break;
            case "leftTop":
                ocp.x -= CONST_OBJ.speed;
                ocp.y -= CONST_OBJ.speed;
                if (ocp.x <= confirmPlaced.x) {
                    ocp.x = confirmPlaced.x;
                    ocp.y = confirmPlaced.y;
                    stop = true;
                }
                break;
            case "leftDown":
                ocp.x -= CONST_OBJ.speed;
                ocp.y += CONST_OBJ.speed;
                if (ocp.x <= confirmPlaced.x) {
                    ocp.x = confirmPlaced.x;
                    ocp.y = confirmPlaced.y;
                    stop = true;
                }
                break;
            case "rightTop":
                ocp.x += CONST_OBJ.speed;
                ocp.y -= CONST_OBJ.speed;
                if (ocp.x >= confirmPlaced.x) {
                    ocp.x = confirmPlaced.x;
                    ocp.y = confirmPlaced.y;
                    stop = true;
                }
                break;
            case "rightDown":
                ocp.x += CONST_OBJ.speed;
                ocp.y += CONST_OBJ.speed;
                if (ocp.x >= confirmPlaced.x) {
                    ocp.x = confirmPlaced.x;
                    ocp.y = confirmPlaced.y;
                    stop = true;
                }
                break;
            case "halfTopLeft":
                ocp.x -= CONST_OBJ.speed / 2;
                ocp.y -= CONST_OBJ.speed;
                if (ocp.y <= confirmPlaced.y) {
                    ocp.y = confirmPlaced.y;
                    ocp.x = confirmPlaced.x;
                    stop = true;
                }
                break;
            case "halfDownLeft":
                ocp.x -= CONST_OBJ.speed / 2;
                ocp.y += CONST_OBJ.speed;
                if (ocp.y >= confirmPlaced.y) {
                    ocp.y = confirmPlaced.y;
                    ocp.x = confirmPlaced.x;
                    stop = true;
                }
                break;
            case "halfTopRight":
                ocp.x += CONST_OBJ.speed / 2;
                ocp.y -= CONST_OBJ.speed;
                if (ocp.y <= confirmPlaced.y) {
                    ocp.y = confirmPlaced.y;
                    ocp.x = confirmPlaced.x;
                    stop = true;
                }
                break;
            case "halfDownRight":
                ocp.x += CONST_OBJ.speed / 2;
                ocp.y += CONST_OBJ.speed;
                if (ocp.y >= confirmPlaced.y) {
                    ocp.y = confirmPlaced.y;
                    ocp.x = confirmPlaced.x;
                    stop = true;
                }
                break;
            case "halfLeftTop":
                ocp.x -= CONST_OBJ.speed;
                ocp.y -= CONST_OBJ.speed / 2;
                if (ocp.x <= confirmPlaced.x) {
                    ocp.x = confirmPlaced.x;
                    ocp.y = confirmPlaced.y;
                    stop = true;
                }
                break;
            case "halfRightTop":
                ocp.x += CONST_OBJ.speed;
                ocp.y -= CONST_OBJ.speed / 2;
                if (ocp.x >= confirmPlaced.x) {
                    ocp.x = confirmPlaced.x;
                    ocp.y = confirmPlaced.y;
                    stop = true;
                }
                break;
            case "halfLeftDown":
                ocp.x -= CONST_OBJ.speed;
                ocp.y += CONST_OBJ.speed / 2;
                if (ocp.x <= confirmPlaced.x) {
                    ocp.x = confirmPlaced.x;
                    ocp.y = confirmPlaced.y;
                    stop = true;
                }
                break;
            case "halfRightDown":
                ocp.x += CONST_OBJ.speed;
                ocp.y += CONST_OBJ.speed / 2;
                if (ocp.x >= confirmPlaced.x) {
                    ocp.x = confirmPlaced.x;
                    ocp.y = confirmPlaced.y;
                    stop = true;
                }
                break;
        }

        drawChessPieceList(ccGameCtx, chessPieceList.filter(ele => ele.name !== ocp.name));
        ocp.draw(ccGameCtx);

        if (!stop) {
            window.requestAnimationFrame(offsetChessPiece);
        } else {
            ocp.active = false;
            window.cancelAnimationFrame(animation);
            animation = null;
            inAnimation = false;

            let deadPiece = chessPieceList.find(e => e.name !== ocp.name && e.x === ocp.x && e.y === ocp.y);
            if (deadPiece) {
                if (deadPiece.type === "H") {
                    uiText = deadPiece.factions === "R" ? "黑棋胜" : "红棋胜";
                    gameOver = true;
                } else {
                    deadPieceList.push(deadPiece);
                    chessPieceList = chessPieceList.filter(e => e.name !== deadPiece.name);

                    uiText = "吃";
                }
            }

            if (!gameOver) {
                checkmate();
                actor = actor !== "R" ? "R" : "B";
                $("#cc_actor").text(actor === "R" ? "红棋" : "黑棋");
            }

            if (uiText) {
                uiStartY = CONST_OBJ.bh / 2 + 20;
                ccUiAnimation = window.requestAnimationFrame(drawAFX);
            }
        }
    }
}

function checkmate() {
    let enemyGeneral = chessPieceList.find(e => e.factions !== actor && e.type === "H");
    if (!enemyGeneral)
        return;

    let usPiece = chessPieceList.filter(e => e.factions === actor);
    for (let i = 0; i < usPiece.length; i++) {
        canPlaced = [];
        getCanPlaced(usPiece[i]);
        let check = canPlaced.find(e => e.x === enemyGeneral.x && e.y === enemyGeneral.y);
        if (check) {
            uiText = "将军";
            isCheckmate = true;
            break;
        }
    }
}

function drawAFX() {
    clearTimeout(uiTimeOut);
    if (uiStartY <= CONST_OBJ.bh / 2) {
        uiStartY = CONST_OBJ.bh / 2;
        window.cancelAnimationFrame(ccUiAnimation);
        uiTimeOut = setTimeout(() => {
            uiText = "";
            ccUiCtx.clearRect(0, 0, CONST_OBJ.bw, CONST_OBJ.bh);
        }, 1000);
    } else {
        uiStartY -= 2;

        ccUiCtx.clearRect(0, 0, CONST_OBJ.bw, CONST_OBJ.bh);
        ccUiCtx.save();
        ccUiCtx.translate(CONST_OBJ.bw / 2, uiStartY);
        ccUiCtx.font = "96px 华文隶书";
        ccUiCtx.fillStyle = "rgba(255, 0, 0, 0.8)";
        ccUiCtx.textAlign = "center";
        ccUiCtx.textBaseline = "middle";
        ccUiCtx.shadowOffsetX = 3;
        ccUiCtx.shadowOffsetY = 3;
        ccUiCtx.shadowColor = 'rgb(0,0,0)';
        ccUiCtx.strokeText(uiText, 0, 0);
        ccUiCtx.fillText(uiText, 0, 0);
        ccUiCtx.restore();
        window.requestAnimationFrame(drawAFX);
    }
}

const drawChessPiece = (c, self) => {
    c.save();

    c.save();
    c.fillStyle = self.backgroundColor;
    c.shadowColor = self.shadowColor;
    c.shadowOffsetX = self.shadowOffsetX;
    c.shadowOffsetY = self.shadowOffsetY;
    c.shadowBlur = 2;
    c.beginPath();
    c.arc(self.x, self.y, self.r, 0, Math.PI * 2);
    c.fill();
    c.restore();

    c.save();
    c.fillStyle = self.color;
    c.shadowColor = self.shadowColor;
    c.shadowOffsetX = 1;
    c.shadowOffsetY = 1;
    c.shadowBlur = 1;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "20px 隶书";
    c.beginPath();
    c.fillText(self.text, self.x, self.y);
    c.restore();

    c.restore();
}


const findCPByXY = (x, y) => {
    return chessPieceList.find(ele => ele.x === x && ele.y === y);
}



function getCanPlaced(self) {
    let arr;
    switch (self.type) {
        case "J":
        case "H":
        case "P":
        case "Z":
            arr = ["top", "right", "down", "left"];
            // Z is not allowed to go back
            if (self.type === "Z") {
                if (self.factions === "B") {
                    arr = arr.filter(e => e !== "top");
                } else {
                    arr = arr.filter(e => e !== "down");
                }
            }

            for (let i = 0; i < arr.length; i++) {
                getJHPZ(self, self.x, self.y, arr[i]);
                if (self.type === "P") {
                    self.hasJump = false;
                }
            }
            break;
        case "M":
            arr = ["halfLeftTop", "halfLeftDown", "halfRightTop", "halfRightDown", "halfTopLeft", "halfDownLeft", "halfTopRight", "halfDownRight"];
            for (let i = 0; i < arr.length; i++) {
                getM(self, self.x, self.y, arr[i]);
            }
            break;
        case "X":
        case "S":
            arr = ["leftTop", "leftDown", "rightTop", "rightDown"];
            for (let i = 0; i < arr.length; i++) {
                getXS(self, self.x, self.y, arr[i], self.type === "X" ? 2 : 1);
            }
            break;
        default:
            break;
    }
}

function getJHPZ(self, x, y, direction) {
    let offsetX = x, offsetY = y;
    switch (direction) {
        case "top":
            offsetY -= CONST_OBJ.cs;
            break;
        case "right":
            offsetX += CONST_OBJ.ls;
            break;
        case "down":
            offsetY += CONST_OBJ.cs;
            break;
        case "left":
            offsetX -= CONST_OBJ.ls;
            break;
    }

    let condition =
        ((self.type === "H" && offsetX >= CONST_OBJ.ls2() && offsetX <= CONST_OBJ.bw - (CONST_OBJ.ls2())) &&
            ((self.factions === "B" && offsetY >= 0 && offsetY <= CONST_OBJ.cs1()) ||
                (self.factions === "R" && offsetY >= CONST_OBJ.bh - CONST_OBJ.cs1() && offsetY <= CONST_OBJ.bh))) ||
        ((self.type === "J" || self.type === "P") && offsetX >= 0 && offsetX <= CONST_OBJ.bw && offsetY >= 0 && offsetY <= CONST_OBJ.bh) ||
        (self.type === "Z" && (((self.factions === "B" && offsetY > CONST_OBJ.cs3() && offsetX >= 0 && offsetX <= CONST_OBJ.bw)
            || (self.factions === "R" && offsetY < CONST_OBJ.cs4() && offsetX >= 0 && offsetX <= CONST_OBJ.bw)) || offsetX === self.x));

    if (condition) {
        if (get({x: offsetX, y: offsetY}, self, direction)) {
            // J & P need to step up
            if (self.type === "J" || self.type === "P") {
                getJHPZ(self, offsetX, offsetY, direction);
            }
        }
    }
}

function getM(self, x, y, direction) {
    let offsetX, offsetY, palisadeX = x, palisadeY = y;
    switch (direction) {
        case "halfLeftTop":
            offsetX = x - (CONST_OBJ.ls1());
            offsetY = y - CONST_OBJ.cs;
            palisadeX = x - CONST_OBJ.ls;
            break;
        case "halfLeftDown":
            offsetX = x - (CONST_OBJ.ls1());
            offsetY = y + CONST_OBJ.cs;
            palisadeX = x - CONST_OBJ.ls;
            break;
        case "halfRightTop":
            offsetX = x + (CONST_OBJ.ls1());
            offsetY = y - CONST_OBJ.cs;
            palisadeX = x + CONST_OBJ.ls;
            break;
        case "halfRightDown":
            offsetX = x + (CONST_OBJ.ls1());
            offsetY = y + CONST_OBJ.cs;
            palisadeX = x + CONST_OBJ.ls;
            break;
        case "halfTopLeft":
            offsetX = x - CONST_OBJ.ls;
            offsetY = y - (CONST_OBJ.cs1());
            palisadeY = y - CONST_OBJ.cs;
            break;
        case "halfTopRight":
            offsetX = x + CONST_OBJ.ls;
            offsetY = y - (CONST_OBJ.cs1());
            palisadeY = y - CONST_OBJ.cs;
            break;
        case "halfDownLeft":
            offsetX = x - CONST_OBJ.ls;
            offsetY = y + (CONST_OBJ.cs1());
            palisadeY = y + CONST_OBJ.cs;
            break;
        case "halfDownRight":
            offsetX = x + CONST_OBJ.ls;
            offsetY = y + (CONST_OBJ.cs1());
            palisadeY = y + CONST_OBJ.cs;
            break;
    }

    if (offsetX >= 0 && offsetX <= CONST_OBJ.bw && offsetY >= 0 && offsetY <= CONST_OBJ.bh) {
        get({
            x: offsetX, y: offsetY
        }, self, direction, {
            x: palisadeX, y: palisadeY
        });
    }
}

function getXS(self, x, y, direction, cell) {
    let offsetX = x, offsetY = y, palisadeX = x, palisadeY = y;
    if (direction === "leftTop") {
        offsetX -= (CONST_OBJ.ls * cell);
        offsetY -= (CONST_OBJ.cs * cell);
        if (cell !== 1) {
            palisadeX -= CONST_OBJ.ls;
            palisadeY -= CONST_OBJ.cs;
        }
    } else if (direction === "leftDown") {
        offsetX -= (CONST_OBJ.ls * cell);
        offsetY += (CONST_OBJ.cs * cell);
        if (cell !== 1) {
            palisadeX -= CONST_OBJ.ls;
            palisadeY += CONST_OBJ.cs;
        }
    } else if (direction === "rightTop") {
        offsetX += (CONST_OBJ.ls * cell);
        offsetY -= (CONST_OBJ.cs * cell);
        if (cell !== 1) {
            palisadeX += CONST_OBJ.ls;
            palisadeY -= CONST_OBJ.cs;
        }
    } else if (direction === "rightDown") {
        offsetX += (CONST_OBJ.ls * cell);
        offsetY += (CONST_OBJ.cs * cell);
        if (cell !== 1) {
            palisadeX += CONST_OBJ.ls;
            palisadeY += CONST_OBJ.cs;
        }
    }

    if (cell === 2) {
        if (offsetX >= 0 && offsetX <= CONST_OBJ.bw) {
            if ((self.factions === "B" && offsetY >= 0 && offsetY <= CONST_OBJ.cs3()) || (self.factions === "R" && offsetY >= CONST_OBJ.cs4() && offsetY <= CONST_OBJ.bh)) {
                get({
                    x: offsetX, y: offsetY
                }, self, direction, {
                    x: palisadeX, y: palisadeY
                });
            }
        }
    } else {
        if (offsetX >= (CONST_OBJ.ls2()) && offsetX <= (CONST_OBJ.bw - (CONST_OBJ.ls2()))) {
            if ((self.factions === "B" && offsetY >= 0 && offsetY <= (CONST_OBJ.cs2())) || (self.factions === "R" && offsetY >= (CONST_OBJ.bh - (CONST_OBJ.cs1())) && offsetY <= CONST_OBJ.bh)) {
                get({
                    x: offsetX, y: offsetY
                }, self, direction);
            }
        }
    }

}

function get(offset, self, direction, palisade) {
    let res = palisade === undefined || !findCPByXY(palisade.x, palisade.y);
    let isGet = false;
    if (res) {
        let cp = findCPByXY(offset.x, offset.y);
        if (self.type === "P") {
            if (!self.hasJump) {
                res = true;
                self.hasJump = !(!cp);
                isGet = !cp;
            } else {
                res = !cp;
                isGet = cp && self.factions !== cp.factions;
            }
        } else if (self.type === "J") {
            res = !cp;
            isGet = res || cp.factions !== self.factions;
        } else {
            res = false;
            isGet = true;
        }

        if (isGet) {
            canPlaced.push({
                x: offset.x, y: offset.y, r: self.r, direction
            });
        }
    }
    return res;
}

const initChessPieceList = [{
    name: "bLJ", unitX: 0, unitY: 0, type: "J", text: "車", factions: "B", x: 0, y: 0
}, {
    name: "bLM", unitX: 1, unitY: 0, type: "M", text: "馬", factions: "B", x: 0, y: 0
}, {
    name: "bLX", unitX: 2, unitY: 0, type: "X", text: "象", factions: "B", x: 0, y: 0
}, {
    name: "bLS", unitX: 3, unitY: 0, type: "S", text: "士", factions: "B", x: 0, y: 0
}, {
    name: "bH", unitX: 4, unitY: 0, type: "H", text: "将", factions: "B", x: 0, y: 0
}, {
    name: "bRS", unitX: 5, unitY: 0, type: "S", text: "士", factions: "B", x: 0, y: 0
}, {
    name: "bRX", unitX: 6, unitY: 0, type: "X", text: "象", factions: "B", x: 0, y: 0
}, {
    name: "bRM", unitX: 7, unitY: 0, type: "M", text: "馬", factions: "B", x: 0, y: 0
}, {
    name: "bRJ", unitX: 8, unitY: 0, type: "J", text: "車", factions: "B", x: 0, y: 0
}, {
    name: "bLP", unitX: 1, unitY: 2, type: "P", text: "包", factions: "B", x: 0, y: 0
}, {
    name: "bRP", unitX: 7, unitY: 2, type: "P", text: "包", factions: "B", x: 0, y: 0
}, {
    name: "bZ1", unitX: 0, unitY: 3, type: "Z", text: "卒", factions: "B", x: 0, y: 0
}, {
    name: "bZ2", unitX: 2, unitY: 3, type: "Z", text: "卒", factions: "B", x: 0, y: 0
}, {
    name: "bZ3", unitX: 4, unitY: 3, type: "Z", text: "卒", factions: "B", x: 0, y: 0
}, {
    name: "bZ4", unitX: 6, unitY: 3, type: "Z", text: "卒", factions: "B", x: 0, y: 0
}, {
    name: "bZ5", unitX: 8, unitY: 3, type: "Z", text: "卒", factions: "B", x: 0, y: 0
}, {
    name: "rLJ", unitX: 0, unitY: 9, type: "J", text: "俥", factions: "R", x: 0, y: 0
}, {
    name: "rLM", unitX: 1, unitY: 9, type: "M", text: "傌", factions: "R", x: 0, y: 0
}, {
    name: "rLX", unitX: 2, unitY: 9, type: "X", text: "相", factions: "R", x: 0, y: 0
}, {
    name: "rLS", unitX: 3, unitY: 9, type: "S", text: "仕", factions: "R", x: 0, y: 0
}, {
    name: "rH", unitX: 4, unitY: 9, type: "H", text: "帥", factions: "R", x: 0, y: 0
}, {
    name: "rRS", unitX: 5, unitY: 9, type: "S", text: "仕", factions: "R", x: 0, y: 0
}, {
    name: "rRX", unitX: 6, unitY: 9, type: "X", text: "相", factions: "R", x: 0, y: 0
}, {
    name: "rRM", unitX: 7, unitY: 9, type: "M", text: "傌", factions: "R", x: 0, y: 0
}, {
    name: "rRJ", unitX: 8, unitY: 9, type: "J", text: "俥", factions: "R", x: 0, y: 0
}, {
    name: "rLP", unitX: 1, unitY: 7, type: "P", text: "炮", factions: "R", x: 0, y: 0
}, {
    name: "rRP", unitX: 7, unitY: 7, type: "P", text: "炮", factions: "R", x: 0, y: 0
}, {
    name: "rZ1", unitX: 0, unitY: 6, type: "Z", text: "兵", factions: "R", x: 0, y: 0
}, {
    name: "rZ2", unitX: 2, unitY: 6, type: "Z", text: "兵", factions: "R", x: 0, y: 0
}, {
    name: "rZ3", unitX: 4, unitY: 6, type: "Z", text: "兵", factions: "R", x: 0, y: 0
}, {
    name: "rZ4", unitX: 6, unitY: 6, type: "Z", text: "兵", factions: "R", x: 0, y: 0
}, {
    name: "rZ5", unitX: 8, unitY: 6, type: "Z", text: "兵", factions: "R", x: 0, y: 0
}];

for (let i = 0; i < initChessPieceList.length; i++) {
    let ele = initChessPieceList[i];
    ele.r = 17;
    ele.shadowOffsetX = 2;
    ele.shadowOffsetY = 2;
    ele.color = ele.factions === "B" ? "rgb(0, 0, 0)" : "rgb(255,0,0)";
    ele.backgroundColor = "rgb(242, 197, 92)";
    ele.shadowColor = "rgba(0,0,0,0.75)";
    ele.active = false;
}