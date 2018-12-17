var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.strokeStyle = "black";
context.lineWidth = 10;

context.lineJoin = context.lineCap = 'round';
document.body.ontouchstart = function (a) {
    a.preventDefault();
}

//自动设置画板尺寸
autoCanvasSize();
window.onresize = function () {
    autoCanvasSize();
}
//监听用户鼠标或触摸事件
listenToUsers();



//下面是自定义函数
//监听用户鼠标或触摸事件

var mouseClick = false;
var drawEnabled = true;
var eraserEnabled = false;
var lastPoint = [];
var newPoint = [];

function listenToUsers() {
    buttonClick();
    mouseEvent();
    touchEvent();
    changeColor();
    changeWidth();
}

//button click
function buttonClick() {
    drawButton = document.getElementById("brush");
    eraserButton = document.getElementById("eraser");
    deleteAllButton = document.getElementById("delete");
    downloadButton = document.getElementById("download")
    drawButton.onclick = function () {
        drawEnabled = true;
        eraserEnabled = false;
        drawButton.classList.add("active");
        eraserButton.classList.remove("active");
        colorGreen.classList.add("active");
    }
    eraserButton.onclick = function () {
        drawEnabled = false;
        eraserEnabled = true;
        drawButton.classList.remove("active");
        eraserButton.classList.add("active");
    }
    deleteAllButton.onclick = function () {
        var pageWidth = document.documentElement.clientWidth;
        var pageHeight = document.documentElement.clientHeight;
        context.clearRect(0, 0, pageWidth, pageHeight);
    }
    downloadButton.onclick = function () {
        var url = canvas.toDataURL();
        var a = document.getElementById("img");
        a.href = url;
        a.click();
        a.href = "#";
        // document.write('<img src="' + url + '"/>');
    }
}

//change brush color
function changeColor() {
    var removeActive = function () {
        colorBlack.classList.remove("active");
        colorGreen.classList.remove("active");
        colorRed.classList.remove("active");
        colorBlue.classList.remove("active");
    }
    var colorRed = document.getElementById("red");
    var colorGreen = document.getElementById("green");
    var colorBlue = document.getElementById("blue");
    var colorBlack = document.getElementById("black");
    colorBlack.onclick = function () {
        context.strokeStyle = "black";
        removeActive();
        colorBlack.classList.add("active");
    }
    colorGreen.onclick = function () {
        context.strokeStyle = "green";
        removeActive();
        colorGreen.classList.add("active");
    }
    colorRed.onclick = function () {
        context.strokeStyle = "red";
        removeActive();
        colorRed.classList.add("active");
    }
    colorBlue.onclick = function () {
        context.strokeStyle = "blue";
        removeActive();
        colorBlue.classList.add("active");
    }
}

//change brush width
function changeWidth() {
    var width1 = document.getElementById("width1");
    var width2 = document.getElementById("width2");
    var width4 = document.getElementById("width4");
    var width8 = document.getElementById("width8");
    width1.onclick = function () {
        context.lineWidth = 1;
        removeSetWidth();
        width1.classList.add("setLineWidth");

    }
    width2.onclick = function () {
        context.lineWidth = 2;
        removeSetWidth();
        width2.classList.add("setLineWidth");
    }
    width4.onclick = function () {
        context.lineWidth = 4;
        removeSetWidth();
        width4.classList.add("setLineWidth");
    }
    width8.onclick = function () {
        context.lineWidth = 8;
        removeSetWidth();
        width8.classList.add("setLineWidth");
    }
    var removeSetWidth = function(){
        width1.classList.remove("setLineWidth");
        width2.classList.remove("setLineWidth");
        width4.classList.remove("setLineWidth");
        width8.classList.remove("setLineWidth");
    }

}

//eraser
function eraser(newPoint) {
    context.clearRect(newPoint[0] - 3, newPoint[1] - 3, 12, 12);
}

//draw
function draw(lastPoint, newPoint) {
    context.beginPath();
    context.moveTo(lastPoint[0], lastPoint[1])
    context.lineTo(newPoint[0],newPoint[1]);
    context.closePath();
    context.stroke();
}
var points = [];
function midPointBtw(p1, p2) {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2
    };
  }
//mouse event
function mouseEvent() {
    //mouse click
    canvas.onmousedown = function (mouseDown) {
        mouseClick = true;
        var x = mouseDown.clientX-140;
        var y = mouseDown.clientY;
        points.push({ 'x': x, 'y': y });
        lastPoint = [x, y];
    }
    //mouse move
    canvas.onmousemove = function (mouseMove) {
        var x = mouseMove.clientX-140;
        var y = mouseMove.clientY;
        newPoint = [x,y];      
        if (mouseClick) {
            if (drawEnabled) {          
                draw(lastPoint, newPoint);
            } else if (eraserEnabled) {
                eraser(newPoint);
            }
            lastPoint = newPoint;
        }
    }
    //mouseUp
    canvas.onmouseup = function () {
        mouseClick = false;
        points.length = 0;
    }
}

//touch event
function touchEvent() {
    //touch start
    canvas.ontouchstart = function (touchBegin) {
        mouseClick = true;
        var x = touchBegin.touches[0].clientX-140;
        var y = touchBegin.touches[0].clientY;
        lastPoint = [x, y];
    }
    //touch move
    canvas.ontouchmove = function (touchMove) {
        var x = touchMove.touches[0].clientX-140;
        var y = touchMove.touches[0].clientY;
        newPoint = [x, y];
        if (mouseClick) {
            if (drawEnabled) {
                draw(lastPoint, newPoint);
            } else if (eraserEnabled) {
                eraser(newPoint);
            }
            lastPoint = newPoint;
        }
    }
    //touch end
    canvas.ontouchend = function (touchEnd) {
        mouseClick = false;
    }
}

//canvas size
function autoCanvasSize() {
    var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth-140;
    canvas.height = pageHeight;
}
