document.getElementsByTagName("title")[0].innerHTML = "腾景网",
    function () {
        var e = document.documentElement.clientWidth / 750;
        document.documentElement.style.fontSize = 100 * e + "px";
    }();
canvasWidth = Math.floor($("#chart").width())
canvasHeight = Math.floor($("#chart").height())
// console.log( + "-----"+$("#chart").height())
var  axisInfo= {
    axisDis: 30, // 偏移值，用来画坐标轴
    lineWidth:2,
    xAxis: ["9月", "10月", "11月", "12月","1月","",""],
    yAxis: ["500","1625", "2750", "3875", "5000"],
    // 坐标轴缩放比例
    // scale: (max-min)/坐标轴高度
    rotateArrowAngle:25
}
$(function () {
    var canvasWidth = $("#chart").width(),
        canvasHeight = $("#chart").height();
    var ctx = $("#chart")[0].getContext("2d");
    // var step = 50,
    //     clickTimes = 0;
    $("#chart").attr({ "width": Math.floor(canvasWidth) }).attr({ "height": Math.floor(canvasHeight) })

    var axisXLen = canvasWidth * 4 / 5,
        AxisYLen = canvasHeight * 4 / 5,
        clickPointPos = [{
            x: 0,
            y: 0
        }],
        step = axisXLen / axisInfo.xAxis.length + 1;
    //坐标轴原点转换
    ctx.translate(axisInfo.axisDis, canvasHeight - axisInfo.axisDis);

    ctx.rotate(getRad(180))
    ctx.scale(-1, 1);
    //画坐标轴
    drawAxisX(ctx);
    drawAxisY(ctx);
    //第一限象中的文字说明
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = axisInfo.lineWidth;
    ctx.beginPath();
    ctx.font = "12px SimSun";
    ctx.fillStyle = "#ffffff";

    $("#chart").click(function (e) {
        
        var pointsLen = clickPointPos.length;
        //设定可点击的范围
        var rangeStart = clickPointPos[pointsLen - 1].x;
        var rangeEnd = rangeStart + step * 2;
        // console.log(rangeStart+"------"+rangeEnd);
        var  clickXY= getEventPosition(e); 
        var clickX = clickXY.x-axisInfo.axisDis//这里获取的坐标就是以canvas左下角为原点的坐标
        var clickY = clickXY.y - axisInfo.axisDis; //这里获取的坐标就是以canvas左下角为原点的坐标
        // console.log("win" + p.x + " " + p.y);
        var correctAreaClick = ((clickX < axisXLen)) && ((clickY < canvasHeight));
        //如果点击的是在坐标轴里面
        if(correctAreaClick){
            //要求按照顺序点击标点（向右）
            if (rangeStart < clickX && clickX < rangeEnd) {
                clickX = rangeStart + step;
                clickY = clickY ; //真实的鼠标y轴坐标-偏移量
                clickPointPos.push({
                    x: clickX,
                    y: clickY
                });
                
                ctx.fillStyle = "#ffffff";
                ctx.arc(clickX, clickY, 5, Math.PI*2,0,true);
                ctx.closePath();
                ctx.fill();
            }
        }
        
    });
    $(".draw").click(function () {
        drawLine(ctx);
        //画坐标轴
        drawAxisX(ctx);
        drawAxisY(ctx);
    })
    var touchstartY = "",
        i = 0;
    $("#chart")[0].ontouchstart = function (e) {
        touchstartY = e.changedTouches[0].screenY; //得到手指按下点的Y轴值
        //获取点击的位置距离canvas左下角位置
        var bbox = this.getBoundingClientRect();
        var offsetX = e.changedTouches[0].clientX - bbox.left-axisInfo.axisDis,
            offsetY = bbox.bottom - e.changedTouches[0].clientY - axisInfo.axisDis;
        // console.log(offsetX,offsetY);
        clickPointPos.forEach(function (item,index) {
            if ((offsetX > item.x - 5 && offsetX < item.x + 5) && (offsetY > item.y - 5 && offsetY < item.y + 5)){
                console.log('可以拖拽')
                
                // var touchmoveY = "";
                // $("#chart")[0].ontouchmove = function (event) {
                //     i++
                //     touchmoveY = event.changedTouches[0].screenY; //不断监听下拉过程中手指的位置
                // }
            }
        })

    }

    

    var touchendY = "";
    $("#chart")[0].ontouchend = function (event) {
        touchendY = event.changedTouches[0].screenY; //监听释放点的位置
    } 



    function clearCanvas() {
        var c = document.getElementById("chart");
        var cxt = c.getContext("2d");

        cxt.fillStyle = "#ffffff";
        cxt.beginPath();
        cxt.fillRect(0, 0, canvasWidth, canvasHeight);
        cxt.closePath();
    }

    function drawLine(ctx) {
        //清除画布
        clearCanvas();
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // console.log(clickPointPos);
        for (i = 0; i < clickPointPos.length; i++) {
            if (i == 0) {
                ctx.moveTo(clickPointPos[i].x, clickPointPos[i].y);
                // ctx.moveTo(0, 0);
            } else { //注意是从1开始
                //设置控制点
                var ctrlP = getCtrlPoint(clickPointPos, i - 1);
                ctx.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x, ctrlP.pB.y, clickPointPos[i].x, clickPointPos[i].y);
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
            y = canvasHeight - ev.offsetY;
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
        ctx.lineTo(axisXLen+20, 0);
        ctx.stroke();
        ctx.closePath();
        //画箭头
        ctx.beginPath();  
        ctx.lineTo(axisXLen+20, 0);
        ctx.lineTo(axisXLen+20 - Math.cos(getRad(axisInfo.rotateArrowAngle)) * 10, -Math.sin(getRad(axisInfo.rotateArrowAngle)) * 10);
        ctx.stroke();
        ctx.closePath();
        // 画刻度
        var y = -5;
        var index = 0;
        for (var i = step; i <= axisXLen+step; i += step) {
            i = Math.floor(i);
            // console.log(i);
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, y);
            ctx.stroke();
            ctx.closePath();

            ctx.save();
            ctx.scale(1, -1);
            // 参数一：显示的刻度值
            // 参数二：显示水平位置,距离y轴的偏移量
            //参数三：显示的垂直位置，距离x轴的偏移量
            ctx.fillText(axisInfo.xAxis[index], i - step/2, y + 25);
            ctx.restore();
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
        ctx.lineTo(0, AxisYLen);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        // ctx.moveTo(Math.sin(getRad(15)) * 10, 200 - Math.cos(getRad(15)) * 10);
        ctx.lineTo(0, AxisYLen);
        ctx.lineTo(-Math.sin(getRad(axisInfo.rotateArrowAngle)) * 10, AxisYLen - Math.cos(getRad(axisInfo.rotateArrowAngle)) * 10);
        ctx.stroke();
        ctx.closePath();

        // 画刻度
        var x, y;
        x = -5;
        for (y = 50; y < AxisYLen; y += 50) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(0, y);

            ctx.stroke();
            ctx.closePath();
        }

        // 写文字
        x = -25;
        for (y = 50; y < 200; y += 50) {
            ctx.save();

            ctx.scale(1, -1);
            ctx.translate(0,  -200);
            //参数一：显示的刻度值
            //参数二：距离y轴的偏移量，这里为常亮
            //参数三: 距离x轴的偏移量，
            ctx.fillText(200 - y, x, y + 2);
            ctx.restore();
        }
        ctx.restore();
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
