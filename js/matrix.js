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
    setNewCoordsForAllElements() {
        let arr2d = [];
        for (let i = 0; i < this.array2d.length; i++) {
            arr2d.push([]);
            for (let j = 0; j < this.array2d[i].length; j++) {
                let element = this.getElementFromCoords(j, i);
                // if (element instanceof Element.Void || element instanceof Element.SolidImmovable) {
                //     arr2d[i].push('');
                // } else {
                    arr2d[i].push(element.getCoordsToNewMovePosition(this, element.shouldMove(this)));
                // }
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
                    if ((i !== newCords[1] || j !== newCords[0]) ) {
                        let vector = element.shouldMove(this);
                        this.swapElementPositions(element, newCords, vector);
                    }
                }
            }
        }
    }
    swapElementPositions(element, newCoords, vector) {
        let currentVector = vector;
        // Change the loop so that it will change the vector instead of stopping the loop when hitting a solid or liquid
        for (let i = 0; i < element.velocity; i++) {
            if (!currentVector) {
                return
            }
            let nextElement = this.getElementFromCoords(element.x, element.y, currentVector);
            if (nextElement instanceof Element.SolidImmovable || nextElement === undefined) {
                return
            }
            // else if (nextElement instanceof Element.SolidImmovable || nextElement instanceof Element.Liquid) {
            //     currentVector = element.shouldMove(this);
            //     if (!currentVector) {
            //         continue
            //     }
            // }
            nextElement.x = element.x;
            nextElement.y = element.y;
            this.setElementAtCoordsByVector(element, currentVector);
            this.array2d[nextElement.y][nextElement.x] = nextElement;
        }
    }
    getElementFromCoords(x, y, vector = [0, 0]) {
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
