/*jslint browser: true*/
/*global $, jQuery, alert*/
//TO DO: build a new collision detection algorithm, move brick to middle, add top paddle
var ctx;
var x = 100;
var y = 250;
var dx = 2;
var dy = 3;
var width;
var height;
var interval = 0;
var paddlex = 300;
var paddley = 300;
var paddleLength = 100;
var paddleWidth = 12;
var up = false;
var down = false;
var left = false;
var right = false;
var canvasMinY;
var canvasMaxY;
var bricks;
var brickColor;
var rows;
var columns;
var brickWidth;
var brickHeight;
var padding;
var rowHeight;
var colWidth;
var numberOfRow;
var numberOfColumn;

//initialize canvas

function initialize() {
    ctx = $('#canvas')[0].getContext("2d");
    width = $("#canvas").width();
    height = $("canvas").height();
    interval = setInterval(re_draw, 10);
}
//random color generator
function getRndColor() {
        var r = 255 * Math.random() | 0,
            g = 255 * Math.random() | 0,
            b = 255 * Math.random() | 0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    //initialize brick array, set parameter
function initbricks() {
        rows = 8;
        columns = 8;
        brickWidth = (width-40)/8-2;
        brickHeight = 20;
        padding = 2;
        // array to store brick existence
        bricks = new Array(rows);
        for (var i = 0; i < rows; i++) {
            bricks[i] = new Array(columns);
            for (var j = 0; j < columns; j++) {
                bricks[i][j] = 1;
            }
        }
            brickColor = new Array(rows);
        for (var i = 0; i < rows; i++) {
            brickColor[i] = new Array(columns);
            for (var j = 0; j < columns; j++) {
                brickColor[i][j] = getRndColor();
            }
        }
    }
    //initialize mouse activation area
function init_mouse() {
        canvasMinY = $("#canvas").offset().top;
        canvasMaxY = canvasMinY + height;
    }
    //enable mouse tracking
function mouseTrack(event) {
    if (event.pageY > canvasMinY && event.pageY < canvasMaxY) {
        paddley = event.pageY - canvasMinY - paddleLength / 2;
    }
}

$(document).mousemove(mouseTrack);
//directional key press logic
function keyPressed(event) {
        if (event.keyCode === 37) {
            left = true;
        } else if (event.keyCode === 38) {
            up = true;
        } else if (event.keyCode === 39) {
            right = true;
        } else if (event.keyCode === 40) {
            down = true;
        }
    }
    //directional key release logic
function keyReleased(event) {
    if (event.keyCode === 37) {
        left = false;
    } else if (event.keyCode === 38) {
        up = false;
    } else if (event.keyCode === 39) {
        right = false;
    } else if (event.keyCode === 40) {
        down = false;
    }
}

$(document).keydown(keyPressed);
$(document).keyup(keyReleased);
//draw a filled circle
function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    //draw a filled rectangle
function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }
    //clear the screen
function clear() {
        ctx.clearRect(0, 0, width, height);
    }
    //update the canvas
function re_draw() {
    clear();
    //draw ball
    ctx.fillStyle="#1B5E20";
    circle(x, y, 8);
    //paddle control, using input from above
    if (right) {
        paddlex += 5;
    } else if (left) {
        paddlex -= 5;
    }
    if (down) {
        paddley += 5;
    } else if (up) {
        paddley -= 5;
    }
    //create 4 paddles
    ctx.fillStyle="#1B5E20";
    rect(paddlex, height - paddleWidth, paddleLength, paddleWidth);
    //rect(paddlex, 0, paddleLength, paddleWidth);
    rect(width - paddleWidth, paddley, paddleWidth, paddleLength);
    rect(0, paddley, paddleWidth, paddleLength);
    //draw brick
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            ctx.fillStyle=brickColor[i][j];
            if (bricks[i][j] == 1) {
                rect((j * (brickWidth + padding)) + padding + 15, (i * (brickHeight + padding)) + padding, brickWidth, brickHeight);
            }
        }
    }
    //check if hit a brick
    rowHeight = brickHeight + padding;
    colWidth = brickWidth + padding;
    numberOfRow = Math.floor(y / rowHeight);
    numberOfColumn = Math.floor(x / colWidth);
    //if so, reverse the ball and mark the brick as broken
    if (y < rows * rowHeight && x < columns * colWidth && numberOfRow >= 0 && numberOfColumn >= 0 && bricks[numberOfRow][numberOfColumn] == 1) {
        dy = -dy;
        bricks[numberOfRow][numberOfColumn] = 0;
    }

    //remove wall, enable ball to only bounce on paddle at the edge
    if (x + dx < 10) {
        if (y > paddley && y < paddley + paddleLength) {
            dy = 12 * ((y - (paddley + paddleLength / 2)) / paddleLength);
            dx = -1.05 * dx;
        } else {
            clearInterval(interval);
        }
    } else if (x + dx > width - 10) {
        if (y > paddley && y < paddley + paddleLength) {
            dy = 12 * ((y - (paddley + paddleLength / 2)) / paddleLength);
            dx = -1.05 * dx;
        } else {
            clearInterval(interval);
        }
    }
    //too chaotic without top wall, commented for reminder
    if (y + dy < 10) {
        //        if (x > paddlex && x < paddlex + paddleLength) {
        dy = -dy;
        //        } else {
        //            clearInterval(interval);
        //        }
    } else if (y + dy > height - 10) {
        if (x > paddlex && x < paddlex + paddleLength) {
            //allow the ball to change direction based on where it hit the paddle
            dx = 12 * ((x - (paddlex + paddleLength / 2)) / paddleLength);
            dy = -1.05 * dy;
        } else {
            clearInterval(interval);
        }
    }
    x += dx;
    y += dy;
}



initialize();
init_mouse();
initbricks();