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
                matrix.push([]);
                for (let j = 0; j < this.width; j++) {
                    matrix[i].push(new Element.Void(j, i));
                }
            }
            return matrix
        })();
    }
    /*TODO:
    * Refactor the generateNextStepMatrix to just call the step function for each element
    * Maybe create a shouldStep method to determine if an element has room to move
    * This would make the step method on the element simpler, as it would only need to call it if the element should move
     */
    moveAllElements() {
        let arr2d = [];
        for (let i = 0; i < this.array2d.length; i++) {
            arr2d.push([]);
            for (let j = 0; j < this.array2d[i].length; j++) {
                if (this.array2d[i][j].move !== undefined) {
                    let nextStepCoords = this.array2d[i][j].move(j, i, this.array2d);
                    arr2d[i].push(nextStepCoords);
                } else {
                    arr2d[i].push('');
                }
            }
        }
        return arr2d;
    }
    updateElementPositions(stepsArr2d) {
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
