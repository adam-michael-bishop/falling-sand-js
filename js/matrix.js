"use strict"

export {Matrix};

class Matrix {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.array2d = (() => {
            const matrix = [];
            for (let i = 0; i < this.height; i++) {
                matrix[i] = new Array(this.width);
            }
            return matrix
        })();
    }
    fill(element) {
        for (const cellRow of this.array2d) {
            for (let i = 0; i < cellRow.length; i++) {
                cellRow[i] = element;
            }
        }
    }
}
