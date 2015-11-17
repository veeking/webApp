// ui_feedback
document.write("<div class='ui_feedback'><div class='ui_feedback_icon' title='意见反馈'></div><div class='ui_feedback_cnt'><form id='feedbackfrm' method='post'><textarea cols='50' rows='10' name='m' id='_fdm_' placeholder='有任何意见或建议请告诉我们'></textarea><p class='ui_feedback_help'>使用遇到问题？请先进入<a href='http://bbs.qyer.com/faq.php' target='_blank'>帮助中心</a></p><input name='' type='submit' value='提交' class='ui_button' /></form></div></div>");

$(function(){
	var getwordlen = (function(){ 
		var byteLength = function(b)
		{ 
			if (typeof b == "undefined") { 
				return 0 
			} 
			var a = b.match(/[^\x00-\x80]/g); 
			return (b.length + (!a ? 0 : a.length)) 
		}; 
		return function(q, g)
		{
			return byteLength($.trim(q));
		}
	})();
	var isislogin;
	$("#_fdm_").click(function(){
		if(isislogin) return;
		islogin(function(){
			isislogin = true;
		});
	});
	$("#feedbackfrm").submit(function(){
		var cnt = $("#_fdm_").val();
		cnt = $.trim(cnt);
		if('' == cnt|| '有任何意见或建议请告诉我们'==cnt){
			tips.show('意见或建议不能为空');
			return false;
		}
		var len = getwordlen(cnt);
		if(len<20){
			tips.show("不能少于10个字");
			return false;
		}
		
		var title = $("title").html();
		$.post("/api_action_feedback", {'cnt':cnt, 'url':location.href, title:title}, function(json){
			var ret;
			eval("ret="+json);
			if('ok' == ret.result){
				$("#_fdm_").val('');
				tips.show(ret.data.msg);
			}
			else if(77 == ret.error_code){
				ajaxlogin();
			}
			else{
				tips.show(ret.data.msg);
			}
			$(".ui_feedback_cnt").hide();
			$(".ui_feedback_icon").removeClass("ui_feedback_icon_current");
		});
		return false;
	});
	
	if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
		$(window).scroll(function(){
			$('.ui_feedback').css('top', $(document).scrollTop() + 120);
		});
	}
	$(".ui_feedback_icon").toggle(
		function(){
			$(this).addClass("ui_feedback_icon_current");
			$(".ui_feedback_cnt").show();
		},function(){
			$(this).removeClass("ui_feedback_icon_current");
			$(".ui_feedback_cnt").hide();
		}
	);
})