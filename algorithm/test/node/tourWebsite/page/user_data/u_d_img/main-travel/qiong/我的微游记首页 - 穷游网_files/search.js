
function checksearch(){
    if(jQuery("#qyer_head_search_input").val()=="" || jQuery("#qyer_head_search_input").val()==jQuery("#qyer_head_search_input").attr("placeholder")){
        return false;
    }
}


document.writeln("<div class=\"qyer_head_search\" id=\"searchdiv\">");
document.writeln("	<form action=\"http:\/\/search.qyer.com\/index\" method=\"get\" target=\"_blank\">");
document.writeln("		<input id=\"qyer_head_search_input\" name=\"wd\" autocomplete=\"off\" class=\"qyer_head_search_input\" type=\"text\" value=\"\" placeholder=\"搜索目的地\/用户\/攻略\/锦囊\" />");
document.writeln("		<input type=\"submit\" value=\"搜索\" class=\"qyer_head_search_btn\" onclick=\"return checksearch();\" data-bn-ipg=\"1014\" />");
document.writeln("	<\/form>");
document.writeln("	<div class=\"qyer_head_search_drop\" id=\"qyer_head_search_drop\">");
document.writeln("		");
document.writeln("	<\/div>");
document.writeln("<\/div>");

(function($){
    var ipt = $("#qyer_head_search_input"); // input
	var drop = $("#qyer_head_search_drop"); // dropLayer
	var form = $("#searchdiv > form"); //form
    var search_result_arr = [];
    var TID = 0;
	
	var placeholderx = 'placeholder' in document.createElement('input');
	ipt.each(function(){
		if(placeholderx) return false;
		var placeholder=$(this).attr("placeholder");
		if($(this).val()==""){$(this).val(placeholder).css("color","#959595")}
		else if($(this).val()==placeholder){$(this).css("color","#959595")}
		$(this).bind("focus",function(){
			if($(this).val()==placeholder){$(this).val("").css("color","")}
		});
		$(this).bind("blur",function(){
			if($(this).val()==""){$(this).val(placeholder).css("color","#959595")}
		});
	});
	
	//防止光标在input里左右来回跑
	ipt.keydown(function(event){
	    if(event.keyCode == "38" || event.keyCode == "40"){
	        event.preventDefault();
	    }
	});
	
	var defval = ""; // input 默认值
	var index = 0; // 下拉列表索引值
	
    function getSearchHtml(data){
        search_result_arr[data.keyword] = data;
        if(typeof(data) == "object"){
            if(data.status == 1){
                index = 0;
                drop.find("a").removeClass("current");
                if (defval == data.keyword) {
                    drop.html(data.html);
                    drop.show();
                }
            }else{
                drop.hide();
                drop.html("");
            }
        }
    }

    function ajaxsearchhtml(){
        
        var keyword=jQuery("#qyer_head_search_input").val();
        if(keyword==""){
            jQuery("#qyer_head_search_drop").hide();
            return;
        }
        if("undefined" == typeof search_result_arr[keyword]){
             jQuery.ajax({
                type: "get",
                data: "wd="+encodeURIComponent(keyword),
                dataType:"jsonp",
                url: "http://search.qyer.com/select.php?action=getsearchhtml&callback=?",
                success:function(data) {
                    getSearchHtml(data);
                }
             });
        }else{
            getSearchHtml(search_result_arr[keyword]);
        }

    }
    
	// input keyup
	ipt.keyup(function(event){
		var val = $(this).val();
		if(val != ""){
            var key = event.keyCode;
			if(key == 38 && drop.is(":visible")){
				index --;
				if(index < 0){
					index = drop.find("a").length;
				}
                
				selectItem(index, defval);
			}
			else if(key == 40 && drop.is(":visible")){
				index ++;
				if(index > drop.find("a").length){
					index = 0;
				}
                
				selectItem(index, defval);
			}
			else if(key == 13){
			}
            else if(val != defval && val != $(this).attr("placeholder")){
                defval = val; //把默认值改为当前值
				
				clearTimeout(TID);
                TID = setTimeout(function(){
                    ajaxsearchhtml();
                },200);
			}
			
		}
		
	});
	
	ipt.focus(function(){
        var val = $(this).val();
		if(val == "" || val == $(this).attr("placeholder")){
			return false;
		}
        
    	clearTimeout(TID);
    	TID = setTimeout(function(){
            ajaxsearchhtml();            
    	},100);    
    });
	
	//加载并显示下拉菜单
	function showDropList(){
		index = 0;
        drop.find("a").removeClass("current");
		drop.show();
	}
	
	//下拉菜单支持上下选择
	function selectItem(i, defv){
		var lista = drop.find("a");
		var defurl = "http://search.qyer.com/index";
		lista.removeClass("current");
		if(i == 0){
			var url = defurl;
			ipt.val(defv);
		}
		else {
			var that = lista.eq(i-1);
			var parent = that.parent("li");
			that.addClass("current");
			
			if(parent.hasClass("item")){
				var url = that.attr("href");
				ipt.val(defv);
			}
			else {
				var url = defurl;
				var txt = that.text();
				ipt.val(txt);
			}
		}
		form.attr("action",url);
	}
	
	
	$(document).click(function(){
		if(drop.is(":visible")){
			drop.hide();
			drop.find("a").removeClass("current");
		}
	});
    
	drop.click(function(event){
		event.stopPropagation();
	});
    
	$("#searchdiv").click(function(event){
		event.stopPropagation();
	});
    
	form.submit(function(){
		if($(this).attr("action") == ""){
			return false;
		}
	});
})(jQuery);
