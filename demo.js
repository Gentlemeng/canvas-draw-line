var point = [{
        x: 0,
        y: 0
    }, {
        x: 50,
        y: 0
    }, 
    {
        x: 100,
        y: 0
    },
    {
        x: 150,
        y: 0
    }, {
        x: 200,
        y: 0
    }, {
        x: 250,
        y: 0
    }, 
]
$(function () {
    var width = $("#chart").width(),
        height = $("#chart").height(),
        clickPointPos = [];
    $("#chart").click(function (e) {
        var clickX = getEventPosition(e).x; //这里获取的坐标就是以canvas左上角为原点的坐标
        var clickY = getEventPosition(e).y; //这里获取的坐标就是以canvas左上角为原点的坐标
        // console.log("win" + p.x + " " + p.y);
        if(clickPointPos.length){
            if(clickX>clickPointPos[clickPointPos.length-1].x){
                clickPointPos.push({ x: clickX, y: clickY });
            }
        }else{
            clickPointPos.push({x:clickX,y:clickY});
        }
        // console.log(clickPointPos);
    });
    var ctx = $("#chart")[0].getContext("2d");
    //坐标轴原点转换
    var offset = 20; // 偏移值，用来画坐标轴
    ctx.translate(offset, height-offset);
    ctx.rotate(getRad(180))
    ctx.scale(-1, 1);
    //画坐标轴
    drawAxisX(ctx);
    drawAxisY(ctx);
    // ctx.translate(-height/2,height/2)
    // ctx.scale(0,180);
    // ctx.translate(0, height);
    // ctx.rotate(0,Math.PI);
    // ctx.rotate(Math.PI,0);

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.font = "20px SimSun";
    ctx.fillStyle = "#000000";
    
    $(".draw").click(function () {
        //清除画布
        clearCanvas();
        ctx.clearRect(0,0,width,height);
        //获取用户输入的数值
        //放入到 point中
        $(".value").each(function (i, value) {
            // console.log($(value).val())
            if (i > 0) point[i].y = Number($(value).val());
        })
        console.log(point);
        for (i = 0; i < point.length; i++) {
            if (i == 0) {
                ctx.moveTo(point[i].x, point[i].y);
                // ctx.moveTo(0, 0);
            } else { //注意是从1开始
                //设置控制点
                var ctrlP = getCtrlPoint(point, i - 1);
                ctx.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x, ctrlP.pB.y, point[i].x, point[i].y);
                //ctx.fillText("("+point[i].x+","+point[i].y+")",point[i].x,point[i].y);
            }
        }
        ctx.stroke();


    })
    function clearCanvas() {
        var c = document.getElementById("chart");
        var cxt = c.getContext("2d");

        cxt.fillStyle = "#000000";
        cxt.beginPath();
        cxt.fillRect(0, 0, width, height);
        cxt.closePath();
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

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'navy';
        ctx.fillStyle = 'navy';

        // 画轴
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(400, 0);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(400 - Math.cos(getRad(15)) * 10, Math.sin(getRad(15)) * 10);
        ctx.lineTo(400, 0);
        ctx.lineTo(400 - Math.cos(getRad(15)) * 10, -Math.sin(getRad(15)) * 10);
        ctx.stroke();
        ctx.closePath();

        // 画刻度
        var x, y;
        y = 5;
        for (x = 50; x < 400; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, y);

            ctx.stroke();
            ctx.closePath();
        }

        // 写文字
        for (x = 0; x < 400; x += 50) {
            ctx.save();
            ctx.scale(1, -1);
            ctx.fillText(x, x, y + 10);
            ctx.restore();
        }

        ctx.restore();
    }

    function drawAxisY(ctx) {
        ctx.save();

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'navy';
        ctx.fillStyle = 'navy';

        // 画轴
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 200);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(Math.sin(getRad(15)) * 10, 200 - Math.cos(getRad(15)) * 10);
        ctx.lineTo(0, 200);
        ctx.lineTo(-Math.sin(getRad(15)) * 10, 200 - Math.cos(getRad(15)) * 10);
        ctx.stroke();
        ctx.closePath();

        // 画刻度
        var x, y;
        x = 5;
        for (y = 50; y < 200; y += 50) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(0, y);

            ctx.stroke();
            ctx.closePath();
        }

        // 写文字
        x = -19;
        for (y = 50; y < 200; y += 50) {
            ctx.save();

            ctx.scale(1, -1);
            ctx.translate(0, -200);

            ctx.fillText(200 - y, x, y);
            ctx.restore();
        }

        ctx.restore();
    }
})
