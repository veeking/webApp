/**
 * 留言板模块，可用extend进行重构或扩展
 * 
 * @author wangx
 * @version 2013-06-20
 */
var Module_Message = function(){
	
	var _module = function(){
		this.init.apply(this, arguments);
	}
	
	_module.fn = _module.prototype ;
	
	_module.fn.extend = function(obj){
		for(var m in obj){
			_module[m] = obj[m];
		}
		if(obj.init){
			_module.init();
		}
	}
	
	//初始化函数
	_module.fn.init = function(args){
		if(args[0] == undefined){
			throw 'No loading configuration files! ' ;
		}
		
		this.config = $.parseJSON(args[0]);
		
		this.$el = args[1];
		
		this.$form = args[2];
		
		this.render();
	}
	
	_module.fn.render = function(){	
		var self = this ;
		
		//提交表单
		$(this.$form).submit(function(){
			if(self.chksubmit(1)){
				self.addmessage();
			}
			return false ;
		})
		
		$(".ui2_textarea", this.$el).focus(function(){
            $(this).addClass('ui2_focus').parent(".text_border").addClass("ui2_focus");
            $(this).parent(".text_border").removeClass("ui2_error");
            $(this).parents("form").find(".ui2_error_layer").hide();
            qyerUI.autoheight(this,{fontSize:"14px",lineHeight:"24px"});
		}).blur(function(){
			$(this).removeClass('ui2_focus').parent(".text_border").removeClass("ui2_focus");
		}).live('change', function(){
			qyerUI.autoheight(this,{fontSize:"14px",lineHeight:"24px"});
		}).live('keyup', function(){
			self.tiplength(this);
			qyerUI.autoheight(this,{fontSize:"14px",lineHeight:"24px"});
		});
		
		//item列表hover事件
		$(".mod_talk_list_item", this.$el).hover(function(){
			$(this).find(".handle").show();
		}, function(){
			$(this).find(".handle").hide();
		});
		
		$(".delete", this.$el).click(function(e){
			var thiz = this ;
			islogin(function(){
				tips.confirm(e, function(){
					self.delmessage(thiz);
				})
			})
		});
		
		//获取焦点时提示登录
		$("[name="+this.config.cnt.field+"]", this.$form).live('focus', function(){
			ajaxlogin();			
		})
		
		$(".reply", this.$el).click(function(){
			var thiz = this;
			islogin(function(){
				self.replyuser(thiz);
			});
		})
		
		$("._jsjubaomessage").live('click', function(){
			var thiz = this ;
			var cid = $(thiz).attr("data-id") ;
			islogin(function(){
				comment.jubao(comment.REPORT_MESSAGE, cid) ;
			}) ;
		})
	}
	
	// type为1时是添加操作，为2时是修改操作
	_module.fn.chksubmit = function(type){
		var cur, item, val, len, match;
		for(var i in this.config){
			cur = this.config[i];
			if((type == 1 && cur.chkadd) || (type == 2 && cur.chkedit)){
				item = $("[name="+cur.field+"]", this.$form);
				match = new RegExp(item.attr('placeholder'), 'i');
				val = item.val().replace(match, '');
				len = util.getwordlen(val);
				//console.log(item);
				if(len < parseInt(cur.minlen)*2 || len > parseInt(cur.maxlen)*2){
					$($(item).attr('erroritem')).show();
					item.addClass('ui2_error');
					return false;
				}else{
					item.removeClass('ui2_error');
					$($(item).attr('erroritem')).hide();
				}
			}
		}
		
		return true ;
	}
	
	_module.fn.tiplength = function(thiz){
		if($(thiz).attr('tiplen')){
			var item = $(thiz).attr('tiplen');
			var val = $(thiz).val();
			var len = Math.ceil(util.getwordlen(val));
			var maxlen = parseInt($(thiz).attr("maxlen"));
			$(item).html(Math.ceil(len/2));
			
			if(len > maxlen*2){
				$(item).addClass("sum_error");
			}else{
				$(item).removeClass("sum_error");
			}
		}
	}
	
	_module.fn.addmessage = function(){
		var _cnt = $("[name="+this.config.cnt.field+"]", this.$form).val();
		var _belongid = $("[name="+this.config.belongid.field+"]", this.$form).val();
		var _replyid = /^回复\s@(.+)：/.test(_cnt) ? $("[name="+this.config.replyid.field+"]", this.$form).val() : 0;
		
		if(this.config.type){
			type = this.config.type;
		}
		var data = {};
		data[this.config.cnt.field] = _cnt;
		data[this.config.belongid.field] = _belongid;
		data[this.config.replyid.field] = _replyid;
		if(this.config.type){
			data['type'] = this.config.type;
		}
		
		$("[type=submit]", this.$form).hide();
		$(".ui_button_load", this.$form).show();
		
		$.post("/ajax.php?action=addmessage", data, function(json){
			json = $.parseJSON(json);
			if(json.error_code == 0){
				qyerUI.message({msg: '评论成功', type: 'true'});
				setTimeout(function(){
					if(type == 2){
						//console.log(json);
						//$(".mod_talk_list").prepend(json.data.html);
						 var str = window.location.pathname;
						 str = str.replace(/page\d+/,"page1");
						window.location.href = 'http://'+window.location.host+str+"?rf=msg";
					}else if(type == 1){
						window.location.href = 'http://'+window.location.host+window.location.pathname+"?rf=msg";
					}
					
				}, 1500);
			}else{
				qyerUI.message({msg: json.data.msg, type: 'warn'});
				$("[type=submit]", this.$form).show();
				$(".ui_button_load", this.$form).hide();
			}

		});
	}
	
	_module.fn.delmessage = function(thiz){
		var id = $(thiz).attr('data-id');
		var type = false;
		if(this.config.type){
			type = this.config.type;
		}
		$.post("/ajax.php?action=delmessage", {id: id, type: type}, function(json){
			json = $.parseJSON(json);
			if(json.error_code == 0){
				qyerUI.message({msg: '删除成功', type: 'true'});
				setTimeout(function(){
					window.location.href = 'http://'+window.location.host+window.location.pathname+"?rf=msg";
				}, 3000);
			}else{
				qyerUI.message({msg: json.data.msg, type: 'warn'});
			}
		})
	}
	
	_module.fn.replyuser = function(thiz){
		var replyid = $(thiz).attr('data-id');
		var username = $(thiz).attr('data-username');
		
		$("[name="+this.config.replyid.field+"]", this.$form).val(replyid);
		var cnt = $("[name="+this.config.cnt.field+"]", this.$form);
		cnt[0].focus();
		cnt.val('回复 @' + username + '：');
		this.tiplength(cnt);
		
		var scrollitem = $(thiz).attr('data-scroll') == 'window' ? window : $($(thiz).attr('data-scroll'));
		scrollitem.animate({scrollTop: $(this.$el).parent('div')[0].offsetTop});
	}
	
	return new _module(arguments);
}
