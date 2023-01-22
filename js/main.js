"use strict";

import * as Matrix from "./matrix.js";
import * as Element from "./elements.js";

const pixelToMatrixRatio = 4;
const canvasWidth = 1000;
const canvasHeight = 800;
const canvasId = 'game-window';
const canvas = document.createElement('canvas');
const context = canvas.getContext("2d");
const frameRate = 60;
const updateRateMS = 1000 / frameRate;
const matrix = new Matrix.Matrix(canvasWidth / pixelToMatrixRatio, canvasHeight / pixelToMatrixRatio);
let tickCount = 0;
let togglePause = false;
let toggleFaucet = false;
let mouseHeld = undefined;
let mousePosition;

function tick() {
    if (toggleFaucet) {
        matrix.array2d[0][5] = new Element.Water(5, 0);
        matrix.array2d[0][7] = new Element.Water(7, 0);
        matrix.array2d[0][9] = new Element.Water(9, 0);
    }
    matrix.updateElementPositions(matrix.setNewCoordsForAllElements());
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawMatrixToContext();
    tickCount++
}

function drawMatrixToContext() {
    for (let i = 0; i < matrix.height; i++) {
        for (let j = 0; j < matrix.width; j++) {
            context.fillStyle = matrix.array2d[i][j].color;
            context.fillRect(j * pixelToMatrixRatio, i * pixelToMatrixRatio, pixelToMatrixRatio, pixelToMatrixRatio);
        }
    }
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function setCellFromMousePos(mousePos, element) {
    let xPos = Math.floor((mousePos.x / pixelToMatrixRatio));
    let yPos = Math.floor((mousePos.y / pixelToMatrixRatio));
    // console.log(xPos, yPos, mousePos);
    matrix.setElementAtCoordsByVector(new element(xPos, yPos), [0, 0]);
}

$('body').prepend(canvas).css("background-color", "black");
$('canvas').css("border", "white solid 1px")
    .attr({
        width: `${canvasWidth}`,
        height: `${canvasHeight}`,
        id: canvasId,
    })
    .after("<button id='pause-sim'>pause</button>" +
        "<button id='toggle-faucet'>faucet</button>")
    .mousedown(function (e){
    if (e.button === 0){
        mouseHeld = setInterval(function () {
            setCellFromMousePos(mousePosition, Element.Water);
        }, 10);
    }
    if (e.button === 2){
        mouseHeld = setInterval(function () {
            setCellFromMousePos(mousePosition, Element.Void);
        }, 10);
    }
})
    .mouseup(function (e){
        if (e.button === 0 || e.button === 2) {
            clearInterval(mouseHeld);
        }
    })
    .mousemove(function (e){
        mousePosition = getMousePos(canvas, e);
    })
    .mouseout(function (){
        clearInterval(mouseHeld);
    })
    .contextmenu(function (e){
        e.preventDefault();
    });
$('#pause-sim').click(function (){
    if (!togglePause) {
        clearInterval(gameTick);
        togglePause = true;
    } else {
        gameTick = setInterval(tick, updateRateMS);
        togglePause = false;
    }
});

$('#toggle-faucet').click(function () {
    toggleFaucet = !toggleFaucet;
})

let gameTick = setInterval(tick, updateRateMS);


// matrix.updateSteps(matrix.generateNextStepMatrix());
// drawMatrixToContext();
// matrix.array2d[0][10] = new Element.Sand(10, 0);

// console.log(matrix.array2d[0][10].step(10,0,matrix.array2d));
// console.log(matrix);
// let test = matrix.getElementFromCoords(10, 0);
// console.log(test.getCoordsToNewMovePosition(matrix, test.shouldMove(matrix)));

// matrix.debugFillFirstRow(new Element.Sand());
// console.log(matrix.generateNextStepMatrix());