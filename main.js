let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
context.strokeStyle = "black";
context.lineJoin = 'round';
context.lineCap = 'round';
context.lineWidth = "3"
context.shadowBlur = 10;
context.shadowColor = 'rgb(0, 0, 0)';
document.body.ontouchstart = function (a) {
    a.preventDefault();
}
let somethingDraw = false;
//自动设置画板尺寸
autoCanvasSize();
window.onresize = function () {
    autoCanvasSize();
}
//监听用户鼠标或触摸事件
listenToUsers();

//下面是自定义函数
//监听用户鼠标或触摸事件

let mouseClick = false;
let drawEnabled = true;
let eraserEnabled = false;
let lastPoint = [];
let newPoint = [];

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
        canvas.classList.remove('eraser')
        canvas.classList.add('pen')
    }
    eraserButton.onclick = function () {
        drawEnabled = false;
        eraserEnabled = true;
        drawButton.classList.remove("active");
        eraserButton.classList.add("active");
        canvas.classList.remove('pen')
        canvas.classList.add('eraser')
    }
    deleteAllButton.onclick = function () {
        let pageWidth = document.documentElement.clientWidth;
        let pageHeight = document.documentElement.clientHeight;
        context.clearRect(0, 0, pageWidth, pageHeight);
        drawButton.onclick()
    }
    downloadButton.onclick = function () {
        let url = canvas.toDataURL();
        let a = document.getElementById("img");
        a.href = url;
        a.click();
        a.href = "#";
    }
}

//change brush color
function changeColor() {
    let colors = document.querySelectorAll('.color li');
    let removeActive = function () {
        colors.forEach((item) => {
            item.classList.remove('active')
        })
    }
    colors.forEach((item) => {
        item.addEventListener('click', (e) => {
            context.strokeStyle = e.target.id
            removeActive();
            e.target.classList.add("active");
            drawButton.onclick = function () {
                drawEnabled = true;
                eraserEnabled = false;
                drawButton.classList.add("active");
                eraserButton.classList.remove("active");
                canvas.classList.remove('eraser')
                canvas.classList.add('pen')
            }
            drawButton.onclick()
        })


    })
}

//change brush width
function changeWidth() {
    let range = document.getElementById("lineWidth");
    range.onchange = function () {
        console.log(context.lineWidth)
        context.lineWidth = this.value;
        console.log(context.lineWidth)
    };
}

//eraser
function eraser(newPoint) {
    context.clearRect(newPoint[0] - 10, newPoint[1] - 10, 30, 30);
}

//draw

function draw(points) {
    let p1 = points[0];
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    for (var i = 1, len = points.length; i < len; i++) {
        p1 = points[i];
        context.lineTo(p1.x, p1.y);
    }

    context.stroke();
}
let points = [];

//mouse event
function mouseEvent() {
    var points = [];
    canvas.onmousedown = function (e) {
        mouseClick = true;
        points.push({
            "x": e.clientX,
            "y": e.clientY + 32
        });
    };
    canvas.onmousemove = function (e) {
        let x = e.clientX;
        let y = e.clientY;
        newPoint = [x, y];
        if (!mouseClick) return;
        if (drawEnabled) {
            points.push({
                "x": x,
                "y": y + 32
            });
            draw(points)

        } else if (eraserEnabled) {
            eraser(newPoint)
        }
    };
    canvas.onmouseup = function () {
        mouseClick = false;
        points.length = 0;
    };
}
//touch event
function touchEvent() {
    //touch start
    canvas.ontouchstart = function (touchBegin) {
        mouseClick = true;
        let x = touchBegin.touches[0].clientX;
        let y = touchBegin.touches[0].clientY;
        lastPoint = [x, y];
        points.push({
            x: x,
            y: y + 32
        });

    }
    //touch move
    canvas.ontouchmove = function (touchMove) {
        let x = touchMove.touches[0].clientX;
        let y = touchMove.touches[0].clientY;
        newPoint = [x, y];
        if (mouseClick) {
            if (drawEnabled) {
                points.push({
                    "x": x,
                    "y": y + 32
                });
                draw(points)
                somethingDraw = true;
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
    let pageWidth = document.documentElement.clientWidth;
    let pageHeight = document.documentElement.clientHeight;

    canvas.width = pageWidth;
    canvas.height = pageHeight;
}