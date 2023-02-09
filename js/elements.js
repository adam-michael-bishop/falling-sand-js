"use strict";

const sandColor = "#e1c9a1";
const waterColor = "#497dff";
const stoneColor = "#505050";
const woodColor = "#5e360b";
const smokeColor = "rgba(231,231,231,0.4)";
const charcoalColor = "#2a2a2a";
const fireColor = "rgba(255,60,0,0.6)";

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
        this.velocity = 7;
        this.currentDirection = [0, 0];
        this.moveTo = [0, 0];
        this.shouldMove = false;
        this.flamability = 0;
        this.chanceToExtinguish = 0;
        this.isBurning = false;
        this.shouldBeDestroyed = false;
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
    update(matrix) {

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
    getAdjacentElements(matrix) {
        const adjacentElements = [];
        for (const direction in this.direction) {
            if (arraysAreIdentical(this.direction[direction], this.direction.none)) continue;
            adjacentElements.push(matrix.getElementFromCoords(this.x, this.y, this.direction[direction]));
        }
        return adjacentElements;
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

class Wood extends SolidImmovable {
    constructor(x, y) {
        super(x, y);
        this.name = "wood";
        this.color = woodColor;
        this.flamability = 0.05;
        this.chanceToExtinguish = 0.1;
        this.burnTime = 500;
    }
    update(matrix) {
        super.update();
        this.combust(matrix);
    }
    combust(matrix) {
        if (!this.isBurning) {
            return;
        }
        if (this.chanceToExtinguish > Math.random()) {
            this.isBurning = false;
            this.color = charcoalColor;
        }
        if (this.isBurning) {
            this.color = fireColor;
            for (const adjacentElement of this.getAdjacentElements(matrix)) {
                if (adjacentElement === undefined) continue;
                if (adjacentElement instanceof Void) {
                    this.isBurning = true;
                }
                this.ignite(adjacentElement);
            }
        }
        if (this.burnTime <= 0) {
            this.shouldBeDestroyed = true;
        }
        this.burnTime--;
    }
    ignite(element) {
        if (element.flamability > Math.random()) {
            element.isBurning = true;
        }
    }
}

class Charcoal extends SolidMovable {
    constructor(x, y) {
        super(x, y);
        this.name = "coal";
        this.color = charcoalColor;
    }
}

class Fire extends Element {
    constructor(x, y) {
        super(x, y);
        this.name = "fire";
        this.color = fireColor;
        this.chanceToDie = 0.5;
    }
    update(matrix) {
        super.update(matrix);
        for (const adjacentElement of this.getAdjacentElements(matrix)) {
            if (adjacentElement === undefined) continue;
            this.ignite(adjacentElement);
        }
        this.shouldBeDestroyed = this.chanceToDie > Math.random();
    }
    ignite(element) {
        if (element.flamability > Math.random()) {
            element.isBurning = true;
        }
    }
}

class Smoke extends Gas {
    constructor(x, y) {
        super(x, y);
        this.name = "smoke";
        this.color = smokeColor;
    }
}

const renderedElements = [Sand, Water, Stone, Wood, Fire];

export {Element, Sand, Water, Void, Gas, Solid, Liquid, SolidMovable, SolidImmovable, Stone, renderedElements, arraysAreIdentical};