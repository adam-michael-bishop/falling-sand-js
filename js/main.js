"use strict";

import * as Matrix from "./matrix.js";
import * as Elements from "./elements.js";

const pixelsPerUnit = 4;
const canvasWidth = 700;
const canvasHeight = 500;
const canvasId = 'game-window';
const canvas = document.createElement('canvas');

$('body').prepend(canvas);
$('canvas').attr({
    width: `${canvasWidth}`,
    height: `${canvasHeight}`,
    id: canvasId,
});

console.log($('body'));