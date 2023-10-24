
var myGamePiece;
var myObstacles = [];
var myScore;
var myFinish;
var myCoins = [];
var score = 0;

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myFinish = new component(20, myGameArea.canvas.width, "lightblue", 460, 0, "finish");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class component {
    constructor(width, height, color, x, y, type) {
        this.type = type;
        this.score = 0;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.gravity = 0;
        this.gravitySpeed = 0;
        this.color = color;
    }
    update = function () {
        let ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            if (this.type == "coin") {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fillStyle = "gold";
                ctx.fill();
            }
            else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }
    newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottomTop();
    }
    hitBottomTop = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        var top = 0;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
        if (this.y <= top) {
            this.y = top;
            this.gravitySpeed = 0;
        }
    }

    crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            clearInterval(myGameArea.interval);
            return;
        }
    }
    for (let k = 0; k < myCoins.length; k++) {
        if (myGamePiece.crashWith(myCoins[k])) {
            score += 100;
            myCoins.splice(myCoins.indexOf(myCoins[k]), 1);
        }
    }
    if (myGamePiece.crashWith(myFinish)) {
        myGameArea.clear();
        score += 1000;
        myScore.text = "SCORE: " + score;
        myScore.update();
        myGamePiece.newPos();
        myGamePiece.update();
        myFinish.update();
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].update();
        }
        clearInterval(myGameArea.interval);
        return;
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    score += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
        var coinHeight = Math.floor(Math.random() * (200) + 30);
        myCoins.push(new component(15, 15, "gold", x + 75, coinHeight, "coin"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    for (let i = 0; i < myCoins.length; i++) {
        myCoins[i].x += -1;
        myCoins[i].update();
    }
    myScore.text = "SCORE: " + score;
    myScore.update();
    myGamePiece.x += 0.08;
    myGamePiece.newPos();
    myGamePiece.update();
    myFinish.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}