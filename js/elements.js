"use strict";

const sandColor = "#e1c9a1";
const waterColor = "#497dff";
const stoneColor = "#505050";

function arraysAreIdentical(arr1, arr2){
    if (arr1.length !== arr2.length) return false;
    for (let i = 0, len = arr1.length; i < len; i++){
        if (arr1[i] !== arr2[i]){
            return false;
        }
    }
    return true;
}
function fallLeftOrRightRandom() {
    if (Math.random() >= .5) {
        this.setCurrentDirection(this.direction.downLeft);
        return this;
    } else {
        this.setCurrentDirection(this.direction.downRight);
        return this;
    }
}

/** TODO:
 * need to refactor shouldMove to return a bool only and make another method to determine which vector an Element should move
 *
 *
 */
class Element {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 10;
        this.currentDirection = [0, 0];
        this.moveTo = [0, 0];
        this.shouldMove = false;
        this.direction = {
            up: [0, -1],
            down: [0, 1],
            left: [-1, 0],
            right: [1, 0],
            upLeft: [-1, -1],
            upRight: [1, -1],
            downLeft: [-1, 1],
            downRight: [1, 1],
            none: [0, 0]
        }
    }
    get coords() {
        return [this.x, this.y];
    }
    set coords(coords) {
        const [x, y] = coords;
        this.x = x;
        this.y = y;
    }
    /**
     * @param array2d
     * @param direction direction should be an array that describes the x and y vector of the element's direction.
     *                  [1, 0] Would be to the right. [1, 1] Would be down and to the right diagonal.
     * @returns {Element}
     */
    setCoordsToNewMovePosition({array2d}, direction) {
        let newPos = [this.x, this.y];
        if (direction === false) {
            this.moveTo = newPos;
        }
        for (let i = 0; i < this.velocity; i++) {
            if (!(array2d[this.y + direction[1]][this.x + direction[0]] instanceof Solid)) {
                newPos[0] += direction[0];
                newPos[1] += direction[1];
            }
        }
        this.moveTo = newPos;
        return this;
    }
    changeDirection(matrix) {
        this.setCurrentDirection(this.direction.none);
        return this;
    }
    setMoveToPosition(coords) {
        this.moveTo = coords;
        return this;
    }
    getMoveToPosition() {
        return this.moveTo;
    }
    setCurrentDirection(direction) {
        this.currentDirection = direction;
        return this;
    }
}

class Void extends Element {
    constructor(x, y) {
        super(x, y);
        this.name = "void";
        this.color = "transparent";
        this.shouldMove = false;
    }
}

class Solid extends Element {

}

class Liquid extends Element {
    constructor(x, y) {
        super(x, y);
        this.shouldMove = true;
        this.currentHorizontalDirection = (() => {
            if (Math.random() >= .5) {
                return this.direction.left;
            } else {
                return this.direction.right;
            }
        })();
    }
    changeDirection(matrix) {
        const cellBelow = matrix.getElementFromCoords(this.x, this.y, this.direction.down);
        const cellRight = matrix.getElementFromCoords(this.x, this.y, this.direction.right);
        const cellLeft = matrix.getElementFromCoords(this.x, this.y, this.direction.left);
        const cellBottomRight = matrix.getElementFromCoords(this.x, this.y, this.direction.downRight);
        const cellBottomLeft = matrix.getElementFromCoords(this.x, this.y, this.direction.downLeft);

        if (cellBelow instanceof Void || cellBelow instanceof Gas) {
            this.setCurrentDirection(this.direction.down);
            return this;
        }
        if ((cellBottomLeft instanceof Void || cellBottomLeft instanceof Gas) && (cellBottomRight instanceof Void || cellBottomRight instanceof Gas) ) {
            return fallLeftOrRightRandom.call(this);
        }
        if (cellBottomLeft instanceof Void || cellBottomLeft instanceof Gas) {
            this.setCurrentDirection(this.direction.downLeft);
            return this;
        }
        if (cellBottomRight instanceof Void || cellBottomRight instanceof Gas) {
            this.setCurrentDirection(this.direction.downRight);
            return this;
        }
        if ((cellLeft instanceof Void || cellLeft instanceof Gas) && (cellRight instanceof Void || cellRight instanceof Gas)) {
            if (arraysAreIdentical(this.currentHorizontalDirection, this.direction.left)) {
                this.setCurrentDirection(this.direction.left);
                return this;
            }
            if (arraysAreIdentical(this.currentHorizontalDirection, this.direction.right)) {
                this.setCurrentDirection(this.direction.right);
                return this;
            }
        }
        if (cellLeft instanceof Void || cellLeft instanceof Gas) {
            this.setCurrentDirection(this.direction.left);
            this.currentHorizontalDirection = this.direction.left;
            return this;
        }
        if (cellRight instanceof Void || cellRight instanceof Gas) {
            this.setCurrentDirection(this.direction.right);
            this.currentHorizontalDirection = this.direction.right;
            return this;
        }
        // if ((cellRight instanceof Void || cellRight instanceof Gas) || (cellLeft instanceof Void || cellLeft instanceof Gas)) {
        //     if (arraysAreIdentical(this.currentDirection, this.direction.right)) {
        //         this.setCurrentDirection(this.direction.left);
        //         return this;
        //     }
        //     this.setCurrentDirection(this.direction.right);
        //     return this;
        // }
        this.setCurrentDirection(this.direction.none);
        return this;
    }
}

class Gas extends Element {

}

class SolidMovable extends Solid {
    constructor(x, y) {
        super(x, y);
        this.shouldMove = true;
    }
    changeDirection(matrix) {
        const cellBelow = matrix.getElementFromCoords(this.x, this.y, this.direction.down);
        const cellBottomRight = matrix.getElementFromCoords(this.x, this.y, this.direction.downRight);
        const cellBottomLeft = matrix.getElementFromCoords(this.x, this.y, this.direction.downLeft);

        if (this.y >= matrix.height - 1) {
            this.setCurrentDirection(this.direction.none);
            return this;
        }
        if (!(cellBelow instanceof Solid) && cellBelow !== undefined) {
            this.setCurrentDirection(this.direction.down);
            return this;
        }
        if (!(cellBottomLeft instanceof Solid || cellBottomLeft === undefined) && !(cellBottomRight instanceof Solid || cellBottomRight === undefined)) {
            return fallLeftOrRightRandom.call(this);
        }
        if (!(cellBottomLeft instanceof Solid || cellBottomLeft === undefined)) {
            this.setCurrentDirection(this.direction.downLeft);
            return this;
        }
        if (!(cellBottomRight instanceof Solid || cellBottomRight === undefined)) {
            this.setCurrentDirection(this.direction.downRight);
            return this;
        }
        this.setCurrentDirection(this.direction.none);
        return this;
    }
}

class SolidImmovable extends Solid {

}

class Stone extends SolidImmovable {
    constructor(x, y) {
        super(x, y);
        this.name = "stone";
        this.color = stoneColor;
    }
}

class Sand extends SolidMovable {
    // static color = sandColor;
    constructor(x, y) {
        super(x, y);
        this.name = "sand";
        this.color = sandColor;
    }

}

class Water extends Liquid{
    constructor(x, y) {
        super(x, y);
        this.name = "water";
        this.color = waterColor;
    }
}

const renderedElements = [Sand, Water, Stone];

export {Element, Sand, Water, Void, Gas, Solid, Liquid, SolidMovable, SolidImmovable, Stone, renderedElements, arraysAreIdentical};