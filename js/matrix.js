"use strict"

export {generateMatrix};

function generateMatrix(width, height) {
    const matrix = [];
    for (let i = 0; i < height; i++) {
        matrix[i] = new Array(width);
    }

    return matrix
}