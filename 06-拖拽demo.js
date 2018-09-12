var oldPosition = {
    'x': 100,
    'y': 100
}; //图形的起始点
var area = {
    'w': 50,
    'h': 50
}; //绘制图形的宽高
var cvs = document.getElementById('cvs');

var Drag = function (oldPosition, area, color, canvas) {
    this.oldPosition = oldPosition;
    this.area = area;
    this.color = color;
    this.canvas = canvas;
}
Drag.prototype = {
    init: function () {
        this.drawing();
        this.initEvent();
    },
    drawing: function () {
        var ctx = this.canvas.getContext('2d'); //得到画笔
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //每次绘制前先清除之前绘制的图形
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.oldPosition.x, this.oldPosition.y, this.area.w, this.area.h);
        ctx.closePath();
    },
    // 鼠标相对于canvas左上角的x,y坐标
    window2Canvas: function (x, y) {
        var bbox = this.canvas.getBoundingClientRect();
        var position = {
            x: x - bbox.left,
            y: y - bbox.top
        }
        // console.log(position);
        return position; 
    },
    // 判断绘制的图形位置
    isInRect: function (e) {
        var position = this.window2Canvas(e.clientX, e.clientY);
        if (position.x < this.oldPosition.x || position.x > this.oldPosition.x + this.area.w) {
            return false;
        }
        if (position.y < this.oldPosition.y || position.y > this.oldPosition.y + this.area.h) {
            return false;
        }
        return true;
    },
    initEvent: function () {
        var _this = this;
        this.canvas.onmousemove = function (e) {
            _this.cursorMouseMove(e);
        };
        this.canvas.onmousedown = function (e) {
            _this.mouseDown(e);
        }
        this.canvas.onmouseup = function (e) {
            _this.mouseUp(e);
        }
    },
    cursorMouseMove: function (e) { //当鼠标移到绘制图形上的时候改变鼠标的状态
        // debugger;
        if (this.isInRect(e)) {
            this.canvas.style.cursor = 'move';
        } else {
            this.canvas.style.cursor = 'default';
        }
    },
    mouseDown: function (e) { //当鼠标按下时调用
        if (this.isInRect(e)) {
            var startPosition = this.window2Canvas(e.clientX, e.clientY);

            var startPositionX = startPosition.x - this.oldPosition.x;
            var startPositionY = startPosition.y - this.oldPosition.y;

            var _this = this;
            this.canvas.onmousemove = function (e) { //鼠标移动的时候
                var newPosition = _this.window2Canvas(e.clientX, e.clientY);
                _this.oldPosition.x = newPosition.x - startPositionX;
                _this.oldPosition.y = newPosition.y - startPositionY;
                //判断绘制的图形是否超出canvas的边界
                if (_this.oldPosition.x < 0) _this.oldPosition.x = 0;

                if (_this.oldPosition.x + _this.area.w > _this.canvas.width)
                    _this.oldPosition.x = _this.canvas.width - _this.area.w;

                if (_this.oldPosition.y < 0) _this.oldPosition.y = 0;

                if (_this.oldPosition.y + _this.area.h > _this.canvas.height)
                    _this.oldPosition.y = _this.canvas.height - _this.area.h;
                //边移动边在新的位置绘制图形
                _this.drawing();
            }
        }
    },
    mouseUp: function (e) { //鼠标抬起的时候调用
        var _this = this;
        this.canvas.onmousemove = null;
        this.canvas.onmousemove = function (e) {
            _this.cursorMouseMove(e);
        }
    }
}
var drag = new Drag(oldPosition, area, 'steelblue', cvs);
drag.init();