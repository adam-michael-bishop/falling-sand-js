"use strict";

export {Element, Sand, Water, Void, Gas, Solid, Liquid, SolidMovable};

const sandColor = "#e1c9a1";
const waterColor = "#497dff";

/*TODO:
 *All Elements should have an x and y value that updates anytime they move cells in the matrix
 *Create a shouldMove function that will use the current x and y values to determine if an element should move to a new cell
 */
class Element {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 5;
        this.isMoving = false;
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
    getCoordsToNewMovePosition({array2d}, direction) {
        //direction should be an array that describes the x and y vector of the element's direction
        //[1, 0] would be to the right. [1, 1] would be down and to the right diagonal
        let newPos = [this.x, this.y];
        if (direction === false) {return newPos}
        for (let i = 0; i < this.velocity; i++) {
            if (!(array2d[this.y + direction[1]][this.x + direction[0]] instanceof Solid)) {
                newPos[0] += direction[0];
                newPos[1] += direction[1];
            }
        }
        return newPos;
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

}

class Gas extends Element {

}

class SolidMovable extends Solid {

}

class Sand extends SolidMovable {
    constructor(x, y) {
        super(x, y);
        this.name = "sand";
        this.color = sandColor;
        this.state = "solid";
    }
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

class Water extends Liquid{
    constructor(x, y) {
        super(x, y);
        this.name = "water";
        this.color = waterColor;
        this.state = "liquid";
    }
}