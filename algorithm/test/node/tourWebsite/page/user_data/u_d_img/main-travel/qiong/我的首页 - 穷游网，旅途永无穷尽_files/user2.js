//user v2 
$(function(){
	
	//足迹操作显示
	$(function(){
		$(".u_spoor_more_edit").toggle(function(){
			$(this).addClass("u_spoor_more_edit_click");
		},function(){
			$(this).removeClass("u_spoor_more_edit_click");
		});
	});
	
	///////////修改
	$(".js_edit_link").each(function(){
        var thiz = $(this);
		var box = thiz.parents(".js_edit_box");
		var text = box.find(".js_edit_text");
		var area = box.find(".js_edit_textarea");
        var stars = box.find(".jsstar");
        var staredit = box.find(".jsstaredit");
        var starstips = staredit.find(".jsstaredit").find(".starstips");;
        
		thiz.live('click',function(){
			if(area.is(":hidden")){
				area.slideDown(200);
				text.slideUp(200);
                stars.hide();
                staredit.show();
            }
		});
	});
    
	
	//全部国家下拉
	$(".u_spoor_country .city_hover,.u_spoor_continent_layer").hover(function(){
		var titleLeft = $(".u_spoor_country .city_hover").offset().left;
		var titleTop = $(".u_spoor_country .city_hover").offset().top;
		$(".u_spoor_continent_layer").show();
		$(".u_spoor_continent_layer").css({"left":titleLeft,"top":titleTop});
	},function(){
		$(".u_spoor_continent_layer").hide();
	});
	
	//旅行偏好勾选
	
	
	//文本域高度自动伸展
	var talks = $(".u_set_data_edit");
	talks.find(".ui2_textarea").live("change", function(){
		qyerUI.autoheight(this,{fontSize:"14px",lineHeight:"24px"});
	});
	talks.find(".ui2_textarea").live("keydown", function(){
		qyerUI.autoheight(this,{fontSize:"14px",lineHeight:"24px"});
	});
	talks.find(".ui2_textarea").live("keyup", function(){
		qyerUI.autoheight(this,{fontSize:"14px",lineHeight:"24px"});
	});
	
	//个人资料设置下拉框
	$(".u_select").each(function(){
		$(this).click(function(){//点击显示隐藏
			$(".u_select").css({"position":""});
			$(this).css({"position":"relative"});
			$(".u_select").find(".slist").hide();
			$(this).find(".slist").show();
		});
		$(this).find(".slist li").hover(function(){//显示列表hover状态
			$(this).addClass("hover");
		},function(){
			$(this).removeClass("hover");
		}).click(function(e){//点击列表传值
			e.stopPropagation();
			var sListText = $(this).text();
			$(this).parents(".u_select").find(".stitle em").text(sListText);
			$(this).parents(".slist").hide();
			$(this).parents(".u_select").css({"position":""});
		});
	});
	
	//关注按钮
//	$(".attent_btn").click(function(){
//		if($(this).hasClass("yes_attent_btn")){
//			$(this).removeClass("attent_btn_yes");
//		}else{
//			$(this).addClass("attent_btn_yes");
//		}
//	});
	//编辑个人信息hover
	$(".u_ind_banner .infos_self").hover(
		function(){
			$(this).addClass("infos_edit");
		},
		function(){
			$(this).removeClass("infos_edit");
		}
	);

	var user_share_img = "";
	//地图分享按钮
	// var created = false;//是否创建过分享图片
	$("#map_share_btn").hover(function(){
		var uid = $(this).attr("data-uid");
		if(uid > 0 ){
			$.get("http://www.qyer.com/u/user.php?action=creatsharemig&uid="+uid+"&rnd="+(+new Date()),
				function(rs){
					created = true;
					$("#_jssinaweiboshare_").show();
					$("#_js_map_img").hide();

					var json = JSON.parse(rs);
					user_share_img = json.data.imgsrc;
					__wwwqyer__sharetext = json.data.text;
				});
		}
		$(".map_share_item").show();
		$(this).parent(".mani").addClass("pr");
	},function(){
		$(".map_share_item").hide();
		$(this).parent(".mani").removeClass("pr");
	});

	$("#_jssinaweiboshare_").click(function(){
        weiboshare(__wwwqyer__sharetext, "http://www.qyer.com/u/"+QYER.uid+"/?campaign=weibo&category=zujifenxiang", user_share_img);
    });


	//删除行程单 
	$(".jsdelplan").live("click", function(event){
		var pop_confirm_id = "jsplans_del_confirm";
		var plan_id = $(this).attr('value');
		$('#'+pop_confirm_id).find('.j_button_ok').attr('plan_id',plan_id);

		qyerUI.popup.show({
			id: pop_confirm_id,
			width:400,
			isclose:"show"
		});
	});

	$('.ui_popup .j_button_ok').live("click",function(){
		var plan_id = $(this).attr('plan_id');
		var data = {id: plan_id};
		$.post("http://www.qyer.com/planapi_action_rmplan", data, function(strjson){
			var json = JSON.parse(strjson);
			if("ok"==json.result){
				window.location.reload();
			}else{
				tips.show(json.data.msg);
			}
		});
	});
});