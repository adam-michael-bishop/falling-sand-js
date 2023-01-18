"use strict"
import * as Element from "./elements.js";
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
        this.fill(new Element.Void());
    }
    fill(element) {
        for (const cellRow of this.array2d) {
            for (let i = 0; i < cellRow.length; i++) {
                cellRow[i] = element;
            }
        }
    }
    generateNextStepMatrix() {
        let arr2d = [];
        for (let i = 0; i < this.array2d.length; i++) {
            arr2d.push([]);
            for (let j = 0; j < this.array2d[i].length; j++) {
                if (this.array2d[i][j].step !== undefined) {
                    let nextStepCoords = this.array2d[i][j].step(j, i, this.array2d);
                    arr2d[i].push(nextStepCoords);
                } else {
                    arr2d[i].push('');
                }
            }
        }
        return arr2d;
    }
    updateSteps(stepsArr2d) {
        for (let i = 0; i < this.array2d.length; i++) {
            for (let j = 0; j < this.array2d[i].length; j++) {
                if (stepsArr2d[i][j] !== '') {
                    let swappedElement = this.swapElementPositions(this.array2d[i][j], stepsArr2d[i][j]);
                    this.array2d[i][j] = swappedElement;
                }
            }
        }
    }
    swapElementPositions(element, coords) {
        let swappedElement = this.array2d[coords.y][coords.x];
        this.array2d[coords.y][coords.x] = element;
        return swappedElement;
    }
}
