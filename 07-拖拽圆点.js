document.getElementsByTagName("title")[0].innerHTML = "腾景网",
    function () {
        var e = document.documentElement.clientWidth / 750;
        document.documentElement.style.fontSize = 100 * e + "px";
    }();
canvasWidth = Math.floor($("#chart").width())
canvasHeight = Math.floor($("#chart").height())
// console.log( + "-----"+$("#chart").height())
// axisInfo.axisDis
var axisInfo = {
    axisDis: 40, // 偏移值，用来画坐标轴
    lineWidth: 2,
    xAxis: ["9月", "10月", "11月", "12月", "1月", "2月"],
    yAxis: ["500", "1625", "2750", "3875", "5000"],
    rotateArrowAngle: 25
}
$(function () {
    var width = Math.ceil($("#chart").width()),
        height = Math.ceil($("#chart").height());
    var ctx = $("#chart")[0].getContext("2d");
    // var step = 50,
    //     clickTimes = 0;
    $("#chart").attr({
        "width": Math.floor(width)
    }).attr({
        "height": Math.floor(height)
    })

    var axisXLen = width * 4 / 5,
        axisYLen = height * 4 / 5,
        clickPointPos = [{
            x: 0,
            y: 0
        }],
        step = axisXLen / axisInfo.xAxis.length;
    //坐标轴原点转换
    ctx.translate(axisInfo.axisDis, height/2 );

    ctx.rotate(getRad(180))
    ctx.scale(-1, 1);
    ctx.save();
    //画坐标轴
    drawAxisX(ctx);
    drawAxisY(ctx);
    //第一限象中的文字说明
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = axisInfo.lineWidth;
    ctx.beginPath();
    ctx.font = "12px SimSun";
    ctx.fillStyle = "#ffffff";
    //6个点的x坐标
    var points = [];
    for (var i = 0; i < 6; i++) {
        points.push({
            x: parseInt(step) * (i + 1),
            y: 0
        });
    }
    for (var i = 0; i < points.length; i++) {
        ctx.beginPath()
        ctx.fillStyle = "#ffffff";
        ctx.arc(points[i].x, points[i].y, 4, Math.PI * 2, 0, true);
        ctx.closePath();
        ctx.fill();
    }


    // ctx.fillStyle = "#fff";
    // ctx.fillText("fjdklfj", 50, 25);
    $("#chart")[0].ontouchstart = function (e) {
        //获取点击的位置距离canvas左下角位置
        var bbox = this.getBoundingClientRect();
        var offsetX = e.changedTouches[0].clientX - bbox.left - axisInfo.axisDis,
            // offsetY = bbox.bottom - e.changedTouches[0].clientY - axisInfo.axisDis;
            offsetY = -(e.changedTouches[0].clientY-bbox.top-canvasHeight/2);
            // console.log(offsetX+"______"+offsetY)
        // console.log(offsetX,offsetY);
        //判断选中的标点是否为图中的点
        // function judge(){
        var flag = {
            canimove: false
        };
        for (var i = 0; i < points.length; i++) {
            if ((offsetX > points[i].x - 10 && offsetX < points[i].x + 10) && (offsetY > points[i].y - 10 && offsetY < points[i].y+10)) {
                flag.canimove = true;
                flag.i = i;
                break;
            }
        }

        // return flag;
        // }
        $("#chart")[0].ontouchmove = function (e) { //鼠标移动的时候
            if (flag.canimove) {
                //每次绘制前先清除之前绘制的图形
                 clear(ctx);
                //获取点击的位置距离canvas左下角位置
                var bbox = $("#chart")[0].getBoundingClientRect();
                var offsetX = e.changedTouches[0].clientX - bbox.left - axisInfo.axisDis,
                    offsetY = -(e.changedTouches[0].clientY - bbox.top - canvasHeight / 2);
                if (offsetY <= (-axisYLen/2)){
                    offsetY = (-axisYLen / 2);
                }
                if (offsetY >= axisYLen / 2) {
                    offsetY = axisYLen / 2;
                }
                console.log(offsetY*150*2/axisYLen);
                // ctx.fillStyle = "#fff";
                // ctx.fillText("fjdklfj", 50, 25);
                points[flag["i"]].y = offsetY;
                for (var i = 0; i < points.length; i++) {
                    ctx.beginPath()
                    ctx.fillStyle = "#ffffff";
                    ctx.arc(points[i].x, points[i].y, 4, Math.PI * 2, 0, true);
                    ctx.closePath();
                    ctx.fill();
                    //画坐标轴
                    drawAxisX(ctx);
                    drawAxisY(ctx);
                }
            }
            
        }


    }
    $("#chart")[0].ontouchend = function (event) {
        this.ontouchmove = null;
    }
    //阻止拖动小球时的默认事件（整个页面滑动）
    $(".chart_con").on("touchmove", function (e) {
        e.preventDefault();
    })
    $(".draw").click(function () {
        drawLine(ctx);
        //画坐标轴
        drawAxisX(ctx);
        drawAxisY(ctx);
    })


    function clearCanvas() {
        var c = document.getElementById("chart");
        var cxt = c.getContext("2d");

        cxt.fillStyle = "#ffffff";
        cxt.beginPath();
        cxt.fillRect(0, 0, width, height);
        cxt.closePath();
    }

    function drawLine(ctx) {
        //清除画布
        clear(ctx);
        ctx.clearRect(0, 0, width, height);
        // console.log(clickPointPos);
        for (var i = 0; i < points.length; i++) {
            ctx.beginPath()
            ctx.fillStyle = "#ffffff";
            ctx.arc(points[i].x, points[i].y, 4, Math.PI * 2, 0, true);
            ctx.closePath();
            ctx.fill();
        }
        for (i = 0; i < points.length; i++) {
            if (i == 0) {
                ctx.moveTo(points[i].x, points[i].y);
                // ctx.moveTo(0, 0);
            } else { //注意是从1开始
                //设置控制点
                var ctrlP = getCtrlPoint(points, i - 1);
                ctx.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x, ctrlP.pB.y, points[i].x, points[i].y);
                //ctx.fillText("("+point[i].x+","+point[i].y+")",point[i].x,point[i].y);
            }
        }
        ctx.stroke();
        // console.log(clickPointPos);
    }
    /*
     *根据已知点获取第i个控制点的坐标
     *param ps	已知曲线将经过的坐标点
     *param i	第i个坐标点
     *param a,b	可以自定义的正数
     */
    function getCtrlPoint(ps, i, a, b) {
        if (!a || !b) {
            a = 0.25;
            b = 0.25;
        }
        //处理两种极端情形
        if (i < 1) {
            var pAx = ps[0].x + (ps[1].x - ps[0].x) * a;
            var pAy = ps[0].y + (ps[1].y - ps[0].y) * a;
        } else {
            var pAx = ps[i].x + (ps[i + 1].x - ps[i - 1].x) * a;
            var pAy = ps[i].y + (ps[i + 1].y - ps[i - 1].y) * a;
        }
        if (i > ps.length - 3) {
            var last = ps.length - 1
            var pBx = ps[last].x - (ps[last].x - ps[last - 1].x) * b;
            var pBy = ps[last].y - (ps[last].y - ps[last - 1].y) * b;
        } else {
            var pBx = ps[i + 1].x - (ps[i + 2].x - ps[i].x) * b;
            var pBy = ps[i + 1].y - (ps[i + 2].y - ps[i].y) * b;
        }
        return {
            pA: {
                x: pAx,
                y: pAy
            },
            pB: {
                x: pBx,
                y: pBy
            }
        }
    }

    //得到点击的坐标
    function getEventPosition(ev) {
        var x, y;
        if (ev.layerX || ev.layerX == 0) {
            x = ev.layerX;
            y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) { //Opera
            x = ev.offsetX;
            //相对左下角原点的y坐标
            y = height - ev.offsetY;
        }
        return {
            x: x,
            y: y
        };
    }
    //角度转弧度 
    function getRad(degree) {
        return degree / 180 * Math.PI;
    }

    function drawAxisX(ctx) {
        ctx.save();
        ctx.lineWidth = axisInfo.lineWidth;
        ctx.font = "16px SimSun";
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#fff';
        // 画轴
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(axisXLen + 20, 0);
        ctx.stroke();
        ctx.closePath();
        //画箭头
        ctx.beginPath();
        ctx.lineTo(axisXLen + 20, 0);
        ctx.lineTo(axisXLen + 20 - Math.cos(getRad(axisInfo.rotateArrowAngle)) * 10, -Math.sin(getRad(axisInfo.rotateArrowAngle)) * 10);
        ctx.stroke();
        ctx.closePath();
        // 画刻度
        var y = -5;
        var index = 0;
        ctx.scale(1, -1);
        //写文字
        for (var i = step; i <= axisXLen; i += step) {
            i = Math.floor(i);
            // console.log(i);
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, y);
            ctx.stroke();
            ctx.closePath();
            // 参数一：显示的刻度值
            // 参数二：显示水平位置,距离y轴的偏移量
            //参数三：显示的垂直位置，距离x轴的偏移量
            ctx.fillText(axisInfo.xAxis[index], i - step / 2, y + 25);
            index++;
        }
        
        ctx.restore();

    }

    function drawAxisY(ctx) {
        ctx.save();

        ctx.lineWidth = axisInfo.lineWidth;
        ctx.font = "16px SimSun";
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#fff';

        // 画轴
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, axisYLen/2);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -axisYLen/2);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.lineTo(0, axisYLen/2);
        ctx.lineTo(-Math.sin(getRad(axisInfo.rotateArrowAngle)) * 10, axisYLen/2 - Math.cos(getRad(axisInfo.rotateArrowAngle)) * 10);
        ctx.stroke();
        ctx.closePath();
        //画刻度
        [50,100,150].forEach((value,i)=>{
             ctx.beginPath();
             ctx.moveTo(-5, axisYLen/6.5*(i+1));
             ctx.lineTo(0, axisYLen / 6.5 * (i + 1));
             ctx.stroke();
             ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(-5, -axisYLen / 6.5 * (i + 1));
            ctx.lineTo(0, -axisYLen / 6.5 * (i + 1));
            ctx.stroke();
            ctx.closePath();
        })

        // 写文字
        x = -40;
        
        ctx.scale(1, -1);

        [50, 100, 150].forEach((value, i) => {
            //参数一：显示的刻度值
            //参数二：距离y轴的偏移量，这里为常亮
            //参数三: 距离x轴的偏移量，
            ctx.fillText(value, x, -axisYLen / 6.5 * (i + 1) + 5);
            ctx.fillText(-value, x, axisYLen / 6.5 * (i + 1) + 5);
        })
        
        ctx.restore();
        // ctx.fillStyle = "#fff";
        // ctx.fillText("fjdklfj", 50, 25);
    }
    function clear(ctx){
        //移到左上角清除画布
        ctx.clearRect(0 - axisInfo.axisDis, 0 - canvasHeight / 2, width * 2, height * 2);
    }
    







    /*----------------画辅助线，如研究辅助点可不用看--------------*/
    // ctx.font="15px SimSun";
    // for(i=1;i<point.length;i++){
    // 	var ctrlP=getCtrlPoint(point,i-1);
    // 	ctx.beginPath();
    // 	ctx.strokeStyle="#AA0000";//红色是通过点与控制点的连线
    // 	ctx.moveTo(point[i-1].x,point[i-1].y);
    // 	ctx.lineTo(ctrlP.pA.x, ctrlP.pA.y);
    // 	ctx.stroke();
    // 	ctx.beginPath();
    // 	ctx.strokeStyle="#00AA00";//绿色是控制点连线
    // 	ctx.arc(ctrlP.pA.x, ctrlP.pA.y,1,0,2*Math.PI);
    // 	ctx.arc(ctrlP.pB.x, ctrlP.pB.y,1,0,2*Math.PI);
    // 	ctx.fillText("("+ctrlP.pA.x+","+ctrlP.pA.y+")",ctrlP.pA.x,ctrlP.pA.y);
    // 	ctx.fillText("("+ctrlP.pB.x+","+ctrlP.pB.y+")",ctrlP.pB.x,ctrlP.pB.y);
    // 	ctx.stroke();
    // 	ctx.beginPath();
    // 	ctx.strokeStyle="#AA0000";
    // 	ctx.moveTo(ctrlP.pB.x, ctrlP.pB.y);
    // 	ctx.lineTo(point[i].x,point[i].y);
    // 	ctx.stroke();
    // }

    /*------------直接lineTo连接点----------*/
    // ctx.beginPath();
    // ctx.strokeStyle="#79ABDC";
    // for(i=1;i<point.length;i++){
    // 	ctx.lineTo( point[i].x, point[i].y);
    // }
    // ctx.stroke();
})