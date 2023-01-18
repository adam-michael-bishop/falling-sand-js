"use strict";

export {Element, Sand, Water, Void};

const sandColor = "#e1c9a1";
const waterColor = "#497dff";

class Element {
    constructor() {}
}

class Void extends Element {
    constructor() {
        super();
        this.name = "void";
        this.color = "transparent";
    }
}

class Sand extends Element {
    constructor() {
        super();
        this.name = "sand";
        this.color = sandColor;
        this.state = "solid";
    }
    step(xIndex, yIndex, arr2d) {
        const coordsCurrent = {y: yIndex, x: xIndex};
        const coordsCellBelow = {y: yIndex + 1, x: xIndex};
        const coordsCellBottomLeft = {y: yIndex + 1, x: xIndex - 1};
        const coordsCellBottomRight = {y: yIndex + 1, x: xIndex + 1};
        let cellBelow;
        let cellBottomLeft;
        let cellBottomRight;

        if (yIndex !== arr2d.length - 1) {
            cellBelow = arr2d[yIndex + 1][xIndex];
        }
        if (xIndex !== 0 && yIndex !== arr2d.length - 1) {
            cellBottomLeft = arr2d[yIndex + 1][xIndex - 1];
        }
        if (xIndex !== arr2d[yIndex].length - 1 && yIndex !== arr2d.length - 1) {
            cellBottomRight = arr2d[yIndex + 1][xIndex + 1];
        }

        if (cellBelow === undefined){
            return coordsCurrent;
        } else if (cellBelow.state === 'solid') {
            if (cellBottomRight === undefined) {
                return coordsCellBottomLeft;
            } else if (cellBottomLeft === undefined) {
                return coordsCellBottomRight;
            } else if (Math.random() < .5){
                return coordsCellBottomLeft;
            } else {
                return coordsCellBottomRight;
            }
        } else {
            return coordsCellBelow;
        }
    }
}

class Water extends Element{
    constructor() {
        super();
        this.name = "water";
        this.color = waterColor;
        this.state = "liquid";
    }
}