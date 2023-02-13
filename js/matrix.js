"use strict"
// import * as Element from "./elements.js";
import {arraysAreIdentical, Gas, Liquid, Solid, SolidImmovable, SolidMovable, Void} from "./elements.js";

class Matrix {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.array2d = (() => {
            const matrix = [];
            for (let i = 0; i < this.height; i++) {
                matrix.push([]);
                for (let j = 0; j < this.width; j++) {
                    matrix[i].push(new Void(j, i));
                }
            }
            return matrix
        })();
    }
    updateAllElements() {
        for (let i = 0; i < this.array2d.length; i++) {
            for (let j = 0; j < this.array2d[i].length; j++) {
                const element = this.getElementFromCoords(j, i);
                element.update(this);
                if (element.shouldBeDestroyed) {
                    this.setElementAtCoords(new element.replaceWith(j, i));
                }
                // if (element.shouldMove) {
                //     element.changeDirection(this);
                // }
            }
        }
        return this;
    }
    moveAllElements() {
        for (let i = 0; i < this.array2d.length; i++) {
            for (let j = 0; j < this.array2d[i].length; j++) {
                let element = this.getElementFromCoords(j, i);
                if (element.shouldMove) {
                    this.swapElementPositions(element, element.currentDirection);
                    element.setCurrentDirection(element.direction.none);
                }
            }
        }
        return this;
    }
    swapElementPositions(element, direction) {
        // let currentVector = direction;
        if (arraysAreIdentical(direction, element.direction.none)) {
            return;
        }
        // Change the loop so that it will change the direction instead of stopping the loop when hitting a solid or liquid
        for (let i = 0; i < element.velocity; i++) {
            let nextElement = this.getElementFromCoords(element.x, element.y, direction);
            if (element instanceof SolidMovable && (nextElement instanceof SolidImmovable || nextElement === undefined)) {
                return;
            }
            if (element instanceof Liquid && (nextElement instanceof Solid || nextElement === undefined))
            {
                return;
            }
            if (element instanceof Gas && (nextElement instanceof Solid || nextElement instanceof Liquid || nextElement === undefined)) {
                return;
            }
            // else if (nextElement instanceof Element.SolidImmovable || nextElement instanceof Element.Liquid) {
            //     currentVector = element.shouldMove(this);
            //     if (!currentVector) {
            //         continue
            //     }
            // }
            nextElement.x = element.x;
            nextElement.y = element.y;
            this.setElementAtCoords(element, direction);
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
    setElementAtCoords(element, vector = [0, 0]) {
        element.x += vector[0];
        element.y += vector[1];
        this.array2d[element.y][element.x] = element;
    }
}

export {Matrix};