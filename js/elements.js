"use strict";

const sandColor = "#e1c9a1";
const waterColor = "#497dff";
const stoneColor = "#505050";

class Element {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 5;
        this.isMoving = false;
        this.moveTo = [];
        this.vector2d = {
            up: [0, -1],
            down: [0, 1],
            left: [-1, 0],
            right: [1, 0],
            upLeft: [-1, -1],
            upRight: [1, -1],
            downLeft: [-1, 1],
            downRight: [1, 1]
        }
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
    shouldMove() {
        return false
    }
    setMoveToPosition(coords) {
        this.moveTo = coords;
    }
    getMoveToPosition() {
        return this.moveTo;
    }
}

class Void extends Element {
    constructor(x, y) {
        super(x, y);
        this.name = "void";
        this.color = "transparent";
    }
}

class Solid extends Element {

}

class Liquid extends Element {
    shouldMove(matrix) {
        const cellBelow = matrix.getElementFromCoords(this.x, this.y, this.vector2d.down);
        const cellRight = matrix.getElementFromCoords(this.x, this.y, this.vector2d.right);
        const cellLeft = matrix.getElementFromCoords(this.x, this.y, this.vector2d.left);

        if (!(cellBelow instanceof Solid) && !(cellBelow instanceof Liquid) && cellBelow !== undefined) {
            this.isMoving = true;
            return this.vector2d.down;
        }
        if ((cellLeft instanceof Void || cellLeft instanceof Gas) && (cellRight instanceof Void || cellRight instanceof Gas)) {
            if (Math.random() >= .5) {
                this.isMoving = true;
                return this.vector2d.left;
            } else {
                this.isMoving = true;
                return this.vector2d.right;
            }
        }
        if (cellLeft instanceof Void || cellLeft instanceof Gas) {
            this.isMoving = true;
            return this.vector2d.left;
        }
        if (cellRight instanceof Void || cellRight instanceof Gas) {
            this.isMoving = true;
            return this.vector2d.right;
        }
        this.isMoving = false;
        return false;
    }
}

class Gas extends Element {

}

class SolidMovable extends Solid {
    shouldMove(matrix) {
        const cellBelow = matrix.getElementFromCoords(this.x, this.y, this.vector2d.down);
        const cellBottomRight = matrix.getElementFromCoords(this.x, this.y, this.vector2d.downRight);
        const cellBottomLeft = matrix.getElementFromCoords(this.x, this.y, this.vector2d.downLeft);

        if (this.y >= matrix.height - 1) {
            this.isMoving = false;
            return false;
        }
        if (!(cellBelow instanceof Solid) && cellBelow !== undefined) {
            this.isMoving = true;
            return this.vector2d.down;
        }
        if (!(cellBottomLeft instanceof Solid || cellBottomLeft === undefined) && !(cellBottomRight instanceof Solid || cellBottomRight === undefined)) {
            if (Math.random() >= .5) {
                this.isMoving = true;
                return this.vector2d.downLeft;
            } else {
                this.isMoving = true;
                return this.vector2d.downRight;
            }
        }
        if (!(cellBottomLeft instanceof Solid || cellBottomLeft === undefined)) {
            this.isMoving = true;
            return this.vector2d.downLeft;
        }
        if (!(cellBottomRight instanceof Solid || cellBottomRight === undefined)) {
            this.isMoving = true;
            return this.vector2d.downRight;
        }

        this.isMoving = false;
        return false;
    }
}

class SolidImmovable extends Solid {
    constructor(x, y) {
        super(x, y);
        this.name = "stone";
        this.color = stoneColor;
        this.state = "solid";
    }
}

class Stone extends SolidImmovable {

}

class Sand extends SolidMovable {
    // static color = sandColor;
    constructor(x, y) {
        super(x, y);
        this.name = "sand";
        this.color = sandColor;
        this.state = "solid";
    }

}

class Water extends Liquid{
    constructor(x, y) {
        super(x, y);
        this.name = "water";
        this.color = waterColor;
        this.state = "liquid";
    }
}

const renderedElements = [Sand, Water, Stone];

export {Element, Sand, Water, Void, Gas, Solid, Liquid, SolidMovable, SolidImmovable, Stone, renderedElements};