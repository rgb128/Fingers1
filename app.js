'use strict';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const FINGER_COLOR = '#ff0';
const ARROW_COLOR = 'red';
const ARROW_WIDTH = 5;

function rotateVector(vector, angleRad) {
    const sin = Math.sin(angleRad);
    const cos = Math.cos(angleRad);
    return rotateVectorBySinAngCos(vector, sin, cos);
}
function rotateVectorBySinAngCos(vector, sin, cos) {
    const x = vector.x * cos - vector.y * sin;
    const y = vector.x * sin + vector.y * cos;
    return { x, y };
}

class FingerBall {
    /** @type {number} */ topSpeed; // px / ms
    /** @type {number} */ leftSpeed; // px / ms
    /** @type {number} */ centerX;
    /** @type {number} */ centerY;
    /** @type {number} */ radius;
    /** @type {number} */ lastTime = 0;

    /**
     * 
     * @param {number} topSpeed px/s
     * @param {number} leftSpeed px/s
     */
    constructor (topSpeed, leftSpeed, centerX, centerY, radius) {
        this.topSpeed = topSpeed / 1000;
        this.leftSpeed = leftSpeed / 1000;
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.lastTime = 0;
        this.draw();
        window.requestAnimationFrame(this.nextTick);
    }

    nextTick = (t) => {
        const delta = t - this.lastTime;
        console.log(delta);
        this.lastTime = t;

        // if (delta > 1000) {
        //     //todo sometimes fix that
        //     alert('You didnt look at me for a long time. Im gonna reload page');
        //     window.location.reload();
        // }

        this.centerX += delta * this.leftSpeed;
        this.centerY += delta * this.topSpeed;

        if (this.centerX <= this.radius) {
            // Bumbed left wall
            this.leftSpeed *= -1;
            const overflow = this.radius - this.centerX; // Always positive
            this.centerX = this.radius + overflow;
        }
        
        if (this.centerX >= canvas.width - this.radius) {
            // Bumbed right wall
            this.leftSpeed *= -1;
            const overflow = this.centerX - (canvas.width - this.radius); // Always positive
            this.centerX = (canvas.width - this.radius) - overflow;
        }

        if (this.centerY <= this.radius) {
            // Bumped top wall
            this.topSpeed *= -1;
            const overflow = this.radius - this.centerY; // Always positive
            this.centerY = this.radius + overflow;
        }

        if (this.centerY >= canvas.height - this.radius) {
            // Bumped top wall
            this.topSpeed *= -1;
            const overflow = this.centerY - (canvas.height - this.radius); // Always positive
            this.centerY = (canvas.height - this.radius) - overflow;
        }

        this.draw();

        window.requestAnimationFrame(this.nextTick);
    };

    draw() {
        context.fillStyle = FINGER_COLOR;
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        context.fill();
        //todo draw nail
    }
}

new FingerBall(47, 23, 250, 250, 20);

