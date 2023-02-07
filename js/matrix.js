"use strict"
import * as Element from "./elements.js";
import {Liquid, SolidMovable} from "./elements.js";

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
        for (let i = 0; i < this.array2d.length; i++) {
            for (let j = 0; j < this.array2d[i].length; j++) {
                const element = this.getElementFromCoords(j, i);
                const newCoords = element.shouldMove(this);
                if (newCoords) {
                    element.setCoordsToNewMovePosition(this, newCoords);
                }
            }
        }
        return this;
    }
    updateElementPositions() {
        for (let i = 0; i < this.array2d.length; i++) {
            for (let j = 0; j < this.array2d[i].length; j++) {
                let element = this.getElementFromCoords(j, i);
                // let newCoords = element.getMoveToPosition();
                if (!(element instanceof Element.Void)) {
                    let vector = element.shouldMove(this);
                    this.swapElementPositions(element, vector);
                }
                element.setMoveToPosition([]);
            }
        }
        return this;
    }
    swapElementPositions(element, vector) {
        let currentVector = vector;
        // Change the loop so that it will change the vector instead of stopping the loop when hitting a solid or liquid
        for (let i = 0; i < element.velocity; i++) {
            if (!currentVector) {
                return
            }
            let nextElement = this.getElementFromCoords(element.x, element.y, currentVector);
            if (element instanceof SolidMovable && (nextElement instanceof Element.SolidImmovable || nextElement === undefined)) {
                return
            }
            if (element instanceof Liquid && (nextElement instanceof Element.Solid || nextElement === undefined))
            {
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

export {Matrix};