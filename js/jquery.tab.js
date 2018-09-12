/**
*调用方式：$.tab("#tabs","#tab_conbox","click");
*/
jQuery.tab = function(tabtit,tab_conbox,e) {
	$(tab_conbox).find("li").hide();
	$(tabtit).find("li:first").addClass("on").show(); 
	$(tab_conbox).find("li:first").show();

	$(tabtit).find("li").bind(e,function(){
	  $(this).addClass("on").siblings("li").removeClass("on"); 
		var activeindex = $(tabtit).find("li").index(this);
		$(tab_conbox).children().eq(activeindex).show().siblings().hide();
		return false;
	});

};