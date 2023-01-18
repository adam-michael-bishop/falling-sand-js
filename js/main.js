"use strict";

import * as Matrix from "./matrix.js";
import * as Element from "./elements.js";

const pixelToMatrixRatio = 4;
const canvasWidth = 500;
const canvasHeight = 400;
const canvasId = 'game-window';
const canvas = document.createElement('canvas');
const context = canvas.getContext("2d");
const frameRate = 60;
const updateRateMS = 1000 / frameRate;
const matrix = new Matrix.Matrix(canvasWidth / pixelToMatrixRatio, canvasHeight / pixelToMatrixRatio);
let tickCount = 0;

function tick() {
    if (tickCount % 2 === 0 && tickCount < 500) {
        matrix.array2d[0][50] = new Element.Sand();
    }
    matrix.updateSteps(matrix.generateNextStepMatrix());
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawMatrixToContext();
    tickCount++
}

//Need to link element color type with the context.fillStyle
function drawMatrixToContext() {
    for (let i = 0; i < matrix.height; i++) {
        for (let j = 0; j < matrix.width; j++) {
            context.fillStyle = matrix.array2d[i][j].color;
            context.fillRect(j * pixelToMatrixRatio, i * pixelToMatrixRatio, pixelToMatrixRatio, pixelToMatrixRatio);
        }
    }
}

$('body').prepend(canvas).css("background-color", "grey");
$('canvas').css("border", "black solid 1px")
    .attr({
        width: `${canvasWidth}`,
        height: `${canvasHeight}`,
        id: canvasId,
    });


// matrix.updateSteps(matrix.generateNextStepMatrix());
// drawMatrixToContext();


// console.log(matrix.array2d[0][10].step(10,0,matrix.array2d));
setInterval(tick, updateRateMS);

// matrix.debugFillFirstRow(new Element.Sand());
// console.log(matrix.generateNextStepMatrix());