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
    setNewCoordsForAllElements() {
        let arr2d = [];
        for (let i = 0; i < this.array2d.length; i++) {
            arr2d.push([]);
            for (let j = 0; j < this.array2d[i].length; j++) {
                let element = this.getElementFromCoords(j, i);
                if (element instanceof Element.Void || element instanceof Element.SolidImmovable) {
                    arr2d[i].push('');
                } else {
                    arr2d[i].push(element.getCoordsToNewMovePosition(this, element.shouldMove(this)));
                }
            }
        }
        return arr2d
    }
    updateElementPositions(arr2d) {
        for (let i = 0; i < this.array2d.length; i++) {
            for (let j = 0; j < this.array2d[i].length; j++) {
                let element = this.getElementFromCoords(j, i);
                let newCords = arr2d[i][j];
                if (!(element instanceof Element.Void)) {
                    if ((i !== newCords[1] || j !== newCords[0]) && newCords !== '') {
                        let vector = element.shouldMove(this);
                        this.swapElementPositions(element, newCords, vector);
                    }
                }
            }
        }
    }
    swapElementPositions(element, newCoords, vector) {
        if (!vector) {return;}
        for (let i = 0; i < element.velocity; i++) {
            let nextElement = this.getElementFromCoords(element.x, element.y, vector);
            if (nextElement instanceof Element.Solid || nextElement === undefined) {
                return
            }
            nextElement.x = element.x;
            nextElement.y = element.y;
            this.setElementAtCoordsByVector(element, vector);
            this.array2d[nextElement.y][nextElement.x] = nextElement;
            i++;
        }
    }
    getElementFromCoords(x, y, vector = [0, 0]) {
        // if (vector[0] !== 0 && vector[1] !== 0) {
        //     console.log(x, y, vector);
        // }
        let xCoords = x + vector[0];
        let yCoords = y + vector[1];
        if (xCoords >= this.width || xCoords < 0 || yCoords >= this.height || yCoords < 0) {
            return undefined
        }
        return this.array2d[yCoords][xCoords];
    }
    setElementAtCoordsByVector(element, vector) {
        element.x += vector[0];
        element.y += vector[1];
        this.array2d[element.y][element.x] = element;
    }
}
