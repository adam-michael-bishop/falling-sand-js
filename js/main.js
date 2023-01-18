"use strict";

import * as Matrix from "./matrix.js";
import * as Elements from "./elements.js";

const pixelToMatrixRatio = 2;
const canvasWidth = 750;
const canvasHeight = 500;
const canvasId = 'game-window';
const canvas = document.createElement('canvas');
const context = canvas.getContext("2d");
const frameRate = 60;
const updateRateMS = 1000 / frameRate;
const matrix = new Matrix.Matrix(canvasWidth / pixelToMatrixRatio, canvasHeight / pixelToMatrixRatio);

function tick() {
    drawMatrixToContext();
}

//Need to link element color type with the context.fillStyle
function drawMatrixToContext() {
    for (let i = 0; i < matrix.height; i++) {
        for (let j = 0; j < matrix.width; j++) {
            context.fillStyle = "initial";
            context.fillRect(j * pixelToMatrixRatio, i * pixelToMatrixRatio, pixelToMatrixRatio, pixelToMatrixRatio);
        }
    }
}

$('body').prepend(canvas).css("background-color", "grey");
$('canvas').attr({
    width: `${canvasWidth}`,
    height: `${canvasHeight}`,
    id: canvasId,
});

setInterval(tick, updateRateMS);