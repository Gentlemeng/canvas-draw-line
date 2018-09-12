$(function(){
	bottomConResize();
	$(window).resize(function(){
		windowResize();
		bottomConResize();
	})
	//导航栏图标效果
	$(".nav_item").bind("mouseover",function(){
		$(this).find(".slider_con").css({"display":"block"}).stop(false,false).animate({"width":161},300,"swing");
	});
	$(".nav_item").bind("mouseleave",function(){
		$(this).find(".slider_con").css({"display":"none"}).stop(false,false).css({"width":0});
	});
	$.tab(".tab_con>ul",".tab_con>.tabs","click");//标签页插件
	window.setInterval( "marqueeTimmer()", 3000);
})
function marqueeTimmer(){
		$(".marquee").each(function(i,n){
			
		})
	}
function bottomConResize(){
	var w=$(window).width()-496;
	$(".bottom_con").width(w);
}
function windowResize(){
	if($(window).width()<600){
		$(window).width(600)
	}
}