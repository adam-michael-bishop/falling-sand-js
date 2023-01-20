"use strict";

export {Element, Sand, Water, Void};

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
        this.velocity = 0;
        this.isMoving = false;
        this.isFalling = false;
    }
    setCoordsToNewMovePosition({array2d}, direction) {
        //direction should be an array that describes the x and y vector of the element's direction
        //[1, 0] would be to the right. [1, 1] would be down and to the right diagonal
        for (let i = 0; i < this.velocity; i++) {
            if (array2d[this.y + direction[1]][this.x + direction[0]].state !== "solid") {
                this.x += direction[0];
                this.y += direction[1];
            }
        }
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
    move(matrix) {
        // const coordsCurrent = {y: yIndex, x: xIndex};
        // const coordsCellBelow = {y: yIndex + 1, x: xIndex};
        // const coordsCellBottomLeft = {y: yIndex + 1, x: xIndex - 1};
        // const coordsCellBottomRight = {y: yIndex + 1, x: xIndex + 1};
        // let cellBelow;
        // let cellBottomLeft;
        // let cellBottomRight;
        //
        // if (yIndex !== arr2d.length - 1) {
        //     cellBelow = arr2d[yIndex + 1][xIndex];
        // }
        // if (xIndex !== 0 && yIndex !== arr2d.length - 1) {
        //     cellBottomLeft = arr2d[yIndex + 1][xIndex - 1];
        // }
        // if (xIndex !== arr2d[yIndex].length - 1 && yIndex !== arr2d.length - 1) {
        //     cellBottomRight = arr2d[yIndex + 1][xIndex + 1];
        // }
        //
        // if (cellBelow === undefined){
        //     return coordsCurrent;
        // } else if (cellBelow.state === 'solid') {
        //     if (cellBottomRight === undefined) {
        //         return coordsCellBottomLeft;
        //     } else if (cellBottomLeft === undefined) {
        //         return coordsCellBottomRight;
        //     } else if (Math.random() < .5){
        //         return coordsCellBottomLeft;
        //     } else {
        //         return coordsCellBottomRight;
        //     }
        // } else {
        //     return coordsCellBelow;
        // }
        if (!this.shouldMove(matrix)) {
            return //don't move
        }
        if (matrix.array2d[this.y + 1][this.x].state !== "solid") {

        }
    }
    shouldMove({array2d, width, height}) {
        const cellBelow = array2d[this.y + 1][this.x];
        const cellBottomRight = array2d[this.y + 1][this.x + 1];
        const cellBottomLeft = array2d[this.y + 1][this.x - 1];

        if ((this.y >= height) ||
            (cellBelow.state === "solid" && cellBottomRight.state === "solid" && cellBottomLeft.state === "solid") ||
            (this.x === width && cellBottomLeft.state === "solid" && cellBelow.state === "solid") ||
            (this.x === 0 && cellBottomRight.state === "solid" && cellBelow.state === "solid")) {
            this.isMoving = false;
            return false
        }
        this.isMoving = true;
        return true
    }
}

class Water extends Element{
    constructor(x, y) {
        super(x, y);
        this.name = "water";
        this.color = waterColor;
        this.state = "liquid";
    }
}