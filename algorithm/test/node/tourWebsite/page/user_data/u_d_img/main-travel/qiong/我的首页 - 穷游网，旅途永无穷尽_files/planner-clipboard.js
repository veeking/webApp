var QyerCrossDomainRequest = (function($){
    var _QyerBase64 = function(){
        this._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
        this.decode = function (input) {  
            var output = "";  
           var chr1, chr2, chr3;  
            var enc1, enc2, enc3, enc4;  
           var i = 0;  
           input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
           while (i < input.length) {  
               enc1 = this._keyStr.indexOf(input.charAt(i++));  
               enc2 = this._keyStr.indexOf(input.charAt(i++));  
               enc3 = this._keyStr.indexOf(input.charAt(i++));  
                enc4 = this._keyStr.indexOf(input.charAt(i++));  
                chr1 = (enc1 << 2) | (enc2 >> 4);  
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
               chr3 = ((enc3 & 3) << 6) | enc4;  
                output = output + String.fromCharCode(chr1);  
                if (enc3 != 64) {  
                   output = output + String.fromCharCode(chr2);  
                }  
               if (enc4 != 64) {  
                   output = output + String.fromCharCode(chr3);  
                }  
            }  
            output = this._utf8_decode(output);  
            return output;  
        };
        this._utf8_decode = function (utftext) 
        {
            var string = "";  
            var i = 0;  
            var c = c1 = c2 = 0;  
            while ( i < utftext.length ) {  
               c = utftext.charCodeAt(i);  
                if (c < 128) {  
                   string += String.fromCharCode(c);  
                    i++;  
                } else if((c > 191) && (c < 224)) {  
                    c2 = utftext.charCodeAt(i+1);  
                   string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                    i += 2;  
              } else {  
                    c2 = utftext.charCodeAt(i+1);  
                    c3 = utftext.charCodeAt(i+2);  
                   string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                   i += 3;  
               }  
           }  
           return string;  
        };
    }
    var request = function(){
        this.doc = document;
        this.proxyurl = null;
        this.frame = null;
        this.data = null;
        this.state = 0;
        this.timer = 0;
        this.QyerBase64 = new _QyerBase64();
    };
    
    //创建用于数据传输的通道
    request.prototype.createiframe = function(cb)
    {
        this.state = 0;
        this.proxyurl = "about:blank";
        var frame = this.frame = this.doc.createElement('iframe');
        this.doc.body.appendChild(frame);
        var name = "__QYERCLIP_ckju097_"+(+ new Date());
        frame.contentWindow.name = name;
        frame.style.display = 'none';
        var thiz = this;
        var fn = function()
        {
            if(0 === thiz.state){
                thiz.state = 1;
                frame.contentWindow.location = thiz.proxyurl;
            }
            else if(1 === thiz.state){
                var n = thiz.getdata();
                cb(n);
            }
        };
        if(frame.attachEvent){
        	frame.attachEvent("onload", fn);
        }else{
        	frame.onload = fn;
        }
        return name;
    };
    
    //清空
    request.prototype.clear = function(){
        if(!this.frame) return;
        this.frame.contentWindow.document.write('');
        this.frame.contentWindow.close();
        this.doc.body.removeChild(this.frame);
        this.frame = null;
    };
    
    //取得数据
    request.prototype.getdata = function(cb){
        if(!this.frame) return "";
        this.data = this.frame.contentWindow.name;
        this.clear();
        return this.data;
    };
    
    return new request();
})(jQuery);

var planClipboard = (function($){
	//操作成功
    var tpl_clip_ok = ['<div style="width:426px;margin:100px auto 0;padding:20px;background:#fff;border:5px solid #aeadad; border-color:rgba(0,0,0,0.3); border-radius:8px;">',
	       	'<div class="">',
	        '<div class="">',
	            '<div class="" style="text-align:center;">',
	                '<img src="http://static.qyer.com/images/plan/poppu/qyer_plan_icon_1.png" alt="" style="vertical-align:middle;" /><span style="font-size:12px;line-height:18px;padding-left:10px;">已经加入到行程 <a target="_blank" href="',
	                '',//link 5
	                '">',
	                '',//title 7
	                '</a> 您也可以到个人中心查看行程</span>',
	            '</div>',
	        '</div>',
	    '</div>',
	'</div>',
	'<link href="http://static.qyer.com/css/plan/qyerplanpoppu.css" rel="stylesheet" type="text/css" />'];
    
    var tpl_clip_error = ['<div style="width:336px;margin:100px auto 0;padding:20px;background:#fff;border:5px solid #aeadad; border-color:rgba(0,0,0,0.3); border-radius:8px;">',
	'<div class="">',
        '<div class="">',
            '<div class="" style="text-align:center;">',
                '<img src="http://static.qyer.com/images/plan/poppu/qyer_plan_icon_2.png" alt="" style="vertical-align:middle;margin-right:10px;" />',
                '',//msg 5
            '</div>',
        '</div>',
    '</div>',
'</div>',
'<link href="http://static.qyer.com/css/plan/qyerplanpoppu.css" rel="stylesheet" type="text/css" />'];
 // cookie ### {{{
	function setCookie(name, value)
	{
	    var Days = 365;
	    var exp  = new Date();
	    exp.setTime(exp.getTime() + Days*24*60*60*1000);
	    document.cookie = name + "="+ escape (value) + "; path=/;expires=" + exp.toGMTString();
	}
	function getCookie(name)       
	{
	    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	     if(arr != null) return unescape(arr[2]); return null;
	}
	var cookiekey = "_plan_clip_94sxiwec_hide";
	// cookie ### }}}
	var pc = function(){
		//初始化页面
		this.uid = null; //当前用户uid
		this.page_title = null;
		this.page_link = null;
        this.routeid = null;
        this.routename = null;
        this.routedesc = null;
        this.selection = "";
        
        //用于统计在选择文字时的运动趋势
        this.start_x = 0;
        this.start_y = 0;
        this.end_x = 0;
        this.end_y = 0;
        
        //是否是第一次操作
        this.isfirst_seethis = function(){
        	var v = getCookie(cookiekey);
        	if(v) return false; //不是第一次
        	return true;
        };
        this.token_notfirst = function(){
        	setCookie(cookiekey, 1);
        };
	};
	
	
	
	var ptype = pc.prototype;
	
	//取得页面上选择的内容
	var getselection = function(target)
	{
		var sText = "";
		
		if(/input|textarea/i.test(target.tagName)){
			return "";
		}
		//if (/input|textarea/i.test(target.tagName) && /firefox/i.test(navigator.userAgent)) {
		//	var staIndex=target.selectionStart;
		//	var endIndex=target.selectionEnd;
		//	if(staIndex!=endIndex){
		//		sText=target.value.substring(staIndex,endIndex);
		//	}
		//}
		//else{
			sText = document.selection == undefined ? document.getSelection().toString():document.selection.createRange().text;
		//}
		return sText;
	};
	
	ptype.clickbbstips = function(){
		$(".qyer_plan_mask_234xxsd").parent("div").hide();
		this.token_notfirst();
	};
	
	ptype.reinit_event = function(){
		if(typeof this._downfn == "function") document.onmousedown = this._downfn;
		if(typeof this._upfn == "function") document.onmouseup = this._upfn;
	};
	
	//初始化，并添加mouseup的监听回调
	ptype.init = function(downfn, upfn)
	{
		var thiz = this;
		var o = document;
		var downfnbak = null;
//		if(o.onmousedown){
//			downfnbak = o.onmousedown;
//		}
		o.onmousedown = function(e){
			//if(downfnbak) downfnbak();
			e = window.event || e;
			thiz.start_x = e.clientX, thiz.start_y = e.clientY;
			downfn();
		};
		
		this._downfn = o.onmousedown;
		
		var upfnbak = null;
//		if(o.onmouseup){
//			upfnbak = o.onmouseup;
//		}
		o.onmouseup = function(e)
		{
			/**
			 * 剪辑对自身的弹窗或登录弹窗无效,不出添加按钮
			 */
			var div = $(".qyer_plan_popup_layoutxx");
			var logindiv = $(".ui_pupBox");
			var bbspop = $("#fwin_mods");
			
			//是否需要出现加号按钮 
			var isenable = (div.size()<=0|| div.is(":hidden"))
				&&(logindiv.size()<=0||logindiv.is(":hidden"))
				&&(bbspop.size()<=0|| bbspop.is(":hidden"));
			if(isenable)
			{
				//if(upfnbak) upfnbak();
				var event = window.event || e;
				thiz.end_x = event.clientX;
				thiz.end_y = event.clientY;
				
				var target = event.srcElement ? event.srcElement : event.target;
				var sText = getselection(target);
				sText = $.trim(sText);
				//if("" == sText) return;
				thiz.selection = sText;
				
				upfn(target, event);
			}
		};
		this._upfn = o.onmouseup;
		
		//判断是否需要在页面添加tooltips,只有bbs的详细页才会有
		var href = location.href;
		/*暂时去掉tips提醒
		if(/^http:\/\/bbs\.qyer\.com\/(viewthread|thread)/.test(href)&& thiz.isfirst_seethis())
		{
			//放置弹出层
			var divhtml = [
			           '<div style="width:231px;position:absolute;right:72px;top:-25px;">',
			           '<div class="qyer_plan_mask_234xxsd" style="position:relative;width:231px;height:79px;background:url(http://static.qyer.com/images/plan/poppu/qyer_bbs_layout.png) no-repeat;">',
			       	'<img title="关闭" style="position:absolute;right:6px;top:6px;cursor:pointer;" alt="关闭" onclick="javascript:planClipboard.clickbbstips();" src="http://static.qyer.com/images/bbs/tips_addroute_close.png">',
			       	'</div>',
			       	'</div>'];
			divhtml = divhtml.join("");
			var parentDiv = $(".bbs_floor").eq(0).find("a");
			$(divhtml).insertBefore(parentDiv);
		}*/
	};
	
	//取得页面标题
	ptype.getPageTitle = function(){ 
		return this.page_title = $("title").html();
	};
	
	//取得页面的地址
	ptype.getPagetLink = function(){
		return this.page_link = location.href;
	};
    
    //取得用户选择的内容 
    ptype.getSelectionNote = function(){
        return this.selection;
    };
    
    //显示剪辑对话框
    ptype.showClipDialog = function(text){
    	text = $.trim(text);
    	if("" == text) return;
    	
    	this.selection = text;
        $.getJSON("http://plan.qyer.com/planapi.php?action=clipaddform&callback=?&xxcb=planClipboard.clipdialog_callback");
    };
    //剪辑表单的添加对话框
    ptype.clipdialog_callback = function(json){
        this.showHtml(json.html, json.width);
    };
    
    //弹出对话框
    ptype.showHtml = function(html){
    	var cls = "qyer_plan_popup_layoutxx";
    	var obj = $("."+cls);
    	if(obj.size()<=0){
	    	var layout = "<div class='"+cls+"'></div>";
	    	$("body").append(layout);
	    	obj = $("."+cls);
    	}
    	obj.css({"display":"none","height":$(document).height()});
    	obj.append($(html));
    	obj.show();
    };
    
    //隐藏层及清空层的内容
    ptype.pupclose = function(){
    	$(".qyer_plan_popup_layoutxx").hide();
    	$(".qyer_plan_popup_layoutxx").html("");
    };
    
    //取消
    ptype.cancel = function(){
        this.pupclose();
    };
	
    //保存选中的行程信息
    ptype.setCurSelectedRoute = function(id, name, infodesc){ 
        this.routeid = id;
        this.routename = name; 
        this.routedesc = infodesc;
    };
    
    //取得用户选择的行程信息
    ptype.getSelectedRoute = function(){
        return {id:this.routeid, name:this.routename, desc:this.routedesc};
    };
    
    //确定保存剪辑到此行程
    ptype.confirmSelectPlan = function(cb){
        var routeid = this.routeid;
        if(routeid<=0) {
            tips.show("请先选择行程");
            return;
        }
        
        var data = this.getClipData();
        data.planname = this.routename;
        this.saveClipboard("addclip", data, cb);
    };
    
    //取得用户选择的数据
    ptype.getClipData = function(){
        var title = this.getPageTitle();
        var link = this.getPagetLink();
        var note = this.getSelectionNote();
        return {title:title, link:link, note:note};
    };
    
    //保存剪辑
    //@type: addclip | composeadd
    ptype.saveClipboard = function(type, data, cb){
        var title = data.title, link=data.link, note=data.note;
        var url = "http://plan.qyer.com/planapi.php?action=clipadd&xxcb=planClipboard.saveClipboardCallback";
        var id = "qyer_clipboard_form";
        $("#"+id).attr("action", url);
        $("#"+id+' input[name="title"]').val(title);
        $("#"+id+' input[name="link"]').val(link);
        $("#"+id+' input[name="note"]').val(note);
        $("#"+id+' input[name="type"]').val(type);
        $("#"+id+' input[name="planname"]').val(data.planname);
        
        if("composeadd" == type){
        	$("#"+id+' input[name="planid"]').val(0);
        }else{
        	$("#"+id+' input[name="planid"]').val(this.routeid);
        }
        //生成iframe
        var thiz = this;
        var framename = QyerCrossDomainRequest.createiframe(function(d){
        	thiz.saveClipboardCallback(d);
        	if(typeof cb == 'function'){
        		cb();
        	}
        });
        $("#"+id).attr("target", framename);
        $("#"+id).submit();
    };
    
    //同时添加行程及剪辑
    ptype.addPlanAndClip = function(title, cb){
        var data = this.getClipData();
        data.planname = title;
        this.saveClipboard("composeadd", data, cb);
    };
    
    //此callback由iframe调用
    ptype.saveClipboardCallback = function(json)
    {
    	var thiz = this;
    	var strjson = QyerCrossDomainRequest.QyerBase64.decode(json);
    	try{
    		var ret = $.parseJSON(strjson);
    		//如果执行出错，并且ret.data.addrouteok为真，则需要刷新行程列表
    		var isaddok = ret.data.addrouteok||false;
    		if("ok" == ret.result){
    			thiz.success(ret.data.link, ret.data.title);
    		}else{
    			//刷新列表，防止用户重复添加行程
    			// {{{
    			//var planid = ret.data.plan_id, link = ret.data.link, title = ret.data.title;
    			//thiz.setCurSelectedRoute(planid, title, '');
    			//改变页面的样式
    			//$("#qyerclipcreateipt").val("").hide();
                //$(".qyer_plan_select_list").show();
    			// }}}
    			this.error(ret.data.msg);
    		}
    	}catch(e){}
    };
    
    //操作成功
    ptype.success = function(link, title, fadeouttime){
    	var thiz = this;
    	fadeouttime = fadeouttime || 2;
    	tpl_clip_ok[5] = link;
		tpl_clip_ok[7] = title;
		var html = tpl_clip_ok.join("");
    	thiz.showHtml(html);
    	
    	if(thiz.timer>0) clearTimeout(thiz.timer);
    	thiz.timer = setTimeout(function(){
    		thiz.cancel();
    	}, fadeouttime*1000);
    };
    
    //操作失败
    ptype.error = function(msg, fadeouttime){
    	var thiz = this;
    	fadeouttime = fadeouttime || 3;
    	
    	tpl_clip_error[5] = msg;
    	var html = tpl_clip_error.join("");
    	thiz.showHtml(html);
    	
    	if(thiz.timer>0) clearTimeout(thiz.timer);
    	thiz.timer = setTimeout(function(){
    		thiz.cancel();
    	}, fadeouttime*1000);
    };
    
    //还原到已经选择的行程列表页
    ptype.reload_selected_route = function(){
        var data = planClipboard.getSelectedRoute();
        if(!data) {
        	$("#qyer_plan_clipboard_tipimg_addclip").hide();
        	return;
        }
        
        $(".qyer_plan_select_tit strong").html(data.name);
        $(".qyer_plan_select_tit span").html(data.desc);
    };
    
	var objpc = new pc();
	
	var imgs = {down:"http://static.qyer.com/images/plan/poppu/qyer_plan_tips_ico_up.png", 
			up:"http://static.qyer.com/images/plan/poppu/qyer_plan_tips_ico_down.png"};
	var imgid = "qyer_plan_clipboard_tipimg_addclip";
	
	//加号小按钮
	var popupDialog = function(){
		//如果用户有选择文字，则出现实小图标
		var sx = objpc.start_x, sy = objpc.start_y, ex = objpc.end_x, ey = objpc.end_y;
		var x = ex-sx, y = ey-sy;
		var cha = 14; //偏差值
		var direction = "";
		if( (x>=cha&& y>=cha)||(x<=cha&& y>=cha)){
			direction = "down"; //鼠标是向下的趋势
		}
		else if( (x>=cha&& y<=cha)|| (x<=cha&& y<=cha)){
			direction = "up"; //鼠标的向上的趋势
		}
		var img = imgs[direction];
		var imghtml = '<img src="'+img+'" id="'+imgid+'" style="position:absolute;cursor:pointer;" />';
		var objimg = $("#"+imgid);
		if(objimg.size()>=1){
			objimg.attr("src", img);
		}else{
			$("body").append(imghtml);
		}
		var divx = 43, divy = 41;
		var top = $(document).scrollTop() + ("down"==direction?13:-(13+divy));
		var left = ("down"==direction?-divx*0.65:-divx/2);
		$("#"+imgid).css({left:ex+left, top:ey+top, zIndex:100000});
		$("#"+imgid).show();
	};
	ptype.popupDialog = function(cbjson){
		var where;
		var href = location.href;
		if(/^http:\/\/bbs\.qyer\.com/.test(href)){
			where = "bbsajax.php";
		}else{
			where = "ajax.php";
		}
		var uuid = (cbjson)?cbjson.uid:QYER.uid;
		if(uuid<=0||"0"==uuid||""==uuid){
			$("#"+imgid).hide();
			ajaxlogin(0,'',where, "planClipboard.popupDialog");
		}else{
			var text = objpc.getSelectionNote();
			$("#"+imgid).hide();
			objpc.showClipDialog(text);
		}
	};
	objpc.init(function(){
		//keydown
	},function(target){
		var text = objpc.getSelectionNote();
		if("" == text){
			$("#"+imgid).hide();
			return;
		}
		
		//var allowdomain = "bbs|place|ask|plan";
		var allowdomain = "bbs";
		var exp = new RegExp("^http:\/\/("+allowdomain+")\.(qyer|go2eu)\.com", "i");
		var href = location.href;
		if(exp.test(href))
		{
			if(/^http:\/\/bbs\.qyer\.com/.test(href))
			{
				//只在帖子的内页显示
				if(/^http:\/\/bbs\.qyer\.com\/(viewthread|thread)/.test(href)){
					popupDialog();
					return;
				}else{
					return;
				}
			}
			
//			//判断是否登录
//			if(QYER.uid<=0){
//				ajaxlogin();
//				return;
//			}
//			
//			popupDialog();
		}
	});
	
	$(".qyer_plan_mask_close").live("click", function(){
		objpc.pupclose();
	});
	$("#"+imgid).live("click", function(event){
		planClipboard.popupDialog();
	});
	$("#"+imgid).live("mouseup", function(event){
		event.cancelBubble=true;
		event.returnValue = false;
	});
	
	//当前的状态是否为添加行程还是选择行程
    var isSelectRoute = function(){
        var ipt = $("#qyerclipcreateipt");
        return $(ipt).is(":hidden");
    };
	// 下列操作主要用于弹出层操作 {{{
    //行程选择的下拉列表
    $(".qyer_plan_select_tit strong,.qyer_plan_select_tit span").live("click", function(){
        if($(".qyer_plan_select_list").is(":hidden")){
            $(this).parent().removeClass("qyer_plan_select_tit_bg1").addClass("qyer_plan_select_tit_bg2");
            $(".qyer_plan_select_list").show();
            $("#qyerclipcreateipt").hide();
        }else{
            $(this).parent().removeClass("qyer_plan_select_tit_bg2").addClass("qyer_plan_select_tit_bg1");
            $(".qyer_plan_select_list").hide();
            $("#qyerclipcreateipt").hide();
        }
      //还原用户选定的行程
      objpc.reload_selected_route();
    });
    
    //点击添加,有两种添加，一：添加行程，二：添加行程并添加剪辑
    $("#_qyerclipboardadd").live("click", function(){
    	$(this).attr("disabled","disabled");
    	$(this).val("添加中");
    	$(this).addClass("qyer_button_disabled");
    	var thiz = this;
        if(isSelectRoute()){
        	objpc.confirmSelectPlan(function(){
            	$(thiz).attr("disabled", false);
            	$(thiz).removeClass("qyer_button_disabled");
            });
        }else{
            var title = $("#qyerclipcreateipt").val();
            objpc.addPlanAndClip(title, function(){
            	$(thiz).attr("disabled", false);
            	$(thiz).removeClass("qyer_button_disabled");
            });
        }
    });
    
    //取消操作
    $("#_qyerclipboardcancel").live("click", function(){
        if(isSelectRoute()){
        	objpc.cancel();
        }else{
            //取消输入，返回select
            $("#qyerclipcreateipt").val("").hide();
            $(".qyer_plan_select_list").show();
            objpc.reload_selected_route();
        }
    });
    
    //切换到添加行程的面板
    $(".qyer_plan_select_create").live("click", function(){
        $(".qyer_plan_select_tit").addClass("qyer_plan_select_tit_bgc");
        $(".qyer_plan_select_list").hide();
        $("#qyerclipcreateipt").show().focus();
        $(".qyer_plan_select_tit strong,.qyer_plan_select_tit span").html("");
    });
    
    //从行程列表中选择行程
    $(".qyer_plan_select_list_link").live("click", function(){
        var dataid = $(this).attr("data-id");
        var strong = $(this).find("strong").html();
        var span = $(this).find("span").html();
        objpc.setCurSelectedRoute(dataid, strong, span);
        $(".qyer_plan_select_tit strong").html(strong);
        $(".qyer_plan_select_tit span").html(span);
        $(".qyer_plan_select_list").hide();
        return false;
    });
    
	// }}}
	return objpc;
})(jQuery);