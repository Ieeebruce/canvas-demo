var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.strokeStyle = "black";
context.lineWidth = 10;
context.lineJoin = 'round';
context.lineCap = 'round';
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
        canvas.on('mouseenter', function () {
            canvas.container().style.cursor = 'pointer'
        })

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
    }
}

//change brush color
function changeColor() {
    var removeActive = function () {
        let colors = document.querySelectorAll('.color li')
        colors.forEach((item) => {
            item.classList.remove('active')
        })
    }
    let colors = document.querySelectorAll('.color ol');
    colors[0].addEventListener('click', (e) => {
        context.strokeStyle = e.target.id
        removeActive();
        e.target.classList.add("active");
    })
}

//change brush width
function changeWidth() {
    let range = document.getElementById("lineWidth");
    range.onchange = function () {
        context.lineWidth = this.value;
    };
}

//eraser
function eraser(newPoint) {
    context.clearRect(newPoint[0] - 3, newPoint[1] - 3, 12, 12);
}

//draw
function draw(lastPoint, newPoint) {
    context.beginPath();
    context.moveTo(lastPoint[0], lastPoint[1])
    context.lineTo(newPoint[0], newPoint[1]);
    context.closePath();
    context.stroke();
}
var points = [];

//mouse event
function mouseEvent() {
    //mouse click
    canvas.onmousedown = function (mouseDown) {
        mouseClick = true;
        var x = mouseDown.clientX;
        var y = mouseDown.clientY;
        points.push({
            'x': x,
            'y': y
        });
        lastPoint = [x, y];
    }
    //mouse move
    canvas.onmousemove = function (mouseMove) {
        var x = mouseMove.clientX;
        var y = mouseMove.clientY;
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
        var x = touchBegin.touches[0].clientX;
        var y = touchBegin.touches[0].clientY;
        lastPoint = [x, y];
    }
    //touch move
    canvas.ontouchmove = function (touchMove) {
        var x = touchMove.touches[0].clientX;
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
    //获取视窗大小
    var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
}