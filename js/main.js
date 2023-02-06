"use strict";

import * as Matrix from "./matrix.js";
import * as Elements from "./elements.js";

const pixelToMatrixRatio = 4;
const canvasWidth = 1000;
const canvasHeight = 600;
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
let mousePosition = null;
let paintElement = Elements.Sand;
let brushSize = 2;


function tick() {
    if (toggleFaucet) {
        matrix.array2d[0][5] = new Elements.Water(5, 0);
        matrix.array2d[0][7] = new Elements.Water(7, 0);
        matrix.array2d[0][9] = new Elements.Water(9, 0);
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

function paintCellsToSelectedElement(mousePos, element) {
    const xPos = Math.floor((mousePos.x / pixelToMatrixRatio));
    const yPos = Math.floor((mousePos.y / pixelToMatrixRatio));
    const brushDiameter = (brushSize * 2) + 1;
    const startingCell = {x: xPos - brushSize, y: yPos - brushSize};
    for (let i = 0; i < brushDiameter; i++) {
        for (let j = 0; j < brushDiameter; j++) {
            const currentCell = {x: startingCell.x + j, y: startingCell.y + i}
            const distanceFromCenter = Math.sqrt((Math.abs(currentCell.x - xPos)** 2) + (Math.abs(currentCell.y - yPos) ** 2));
            if (distanceFromCenter <= brushSize && (matrix.getElementFromCoords(currentCell.x, currentCell.y) instanceof Elements.Void || element === Elements.Void)) {
                matrix.setElementAtCoordsByVector(new element(currentCell.x, currentCell.y), [0, 0]);
            }
        }
    }
}

function renderElementCanvas() {
    for (const renderedElement of Elements.renderedElements) {
        const tempEl = new renderedElement(0, 0);
        $('#element-canvas').append(`<div class="element-select"  id="${tempEl.name}">${tempEl.name}</div>`);
        $(`#${tempEl.name}`)
            .click(function () {
                paintElement = renderedElement;
            })
            .css({
                'background-color': `${tempEl.color}`,
                'width': '50px',
                'height': '50px',
                'margin': '2px',
                'display': 'inline-block'
            });
    }
}

$('body').prepend(canvas).css("background-color", "black");
$('canvas').css("border", "white solid 1px")
    .attr({
        width: `${canvasWidth}`,
        height: `${canvasHeight}`,
        id: canvasId,
    })
    .mousedown(function (e){
    if (e.button === 0){
        clearInterval(mouseHeld);
        mouseHeld = setInterval(function () {
            paintCellsToSelectedElement(mousePosition, paintElement);
        }, 10);
    }
    if (e.button === 2){
        clearInterval(mouseHeld);
        mouseHeld = setInterval(function () {
            paintCellsToSelectedElement(mousePosition, Elements.Void);
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
});
$("#debug-tick").click(() => tick());

renderElementCanvas();
// let gameTick = setInterval(tick, updateRateMS);