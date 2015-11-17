// JavaScript Document
 function getStyle(obj,name){
	 if(obj.currentStyle){
		return obj.currentStyle[name];	 
		 }else{
		return getComputedStyle(obj,false)[name];	 
	     }
	 
	 }
	 
 function ajax(url,fnSucc,data){
	 if(window.XMLHttpRequest){
		 var oajax=new XMLHttpRequest();
		 }else{
		 var oajax=new ActiveXObject("Microsoft.XMLHTTP");	 
			 }  //创建ajax
	  
	
	 oajax.open("POST",url,true);  //连接服务器
	 oajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
	 oajax.send(data || null);  // 发送
	 
	 oajax.onreadystatechange=function(){
		  if(oajax.readyState==4){
			  if(oajax.status==200){
				     fnSucc(oajax.responseText); //发送成功
				  }else{
					alert("服务器请求失败");
				  }
			  }
		 }
	}
		 //
 function startMove(obj,json,time,fnEnd){
	  var totalOk,    // totalOk 为是否到达目标值 判断   curr当前对象的 要变化的属性值
	  	  curr,			
		  speed,
		  attr,
		  objStyle=obj.style;
	  clearInterval(obj.timer);
	  
	  time= time || 16.67;      // 如果 不给time值得话 默认为 10
				
	  obj.timer=setInterval(function(){
	  totalOk=true; 
	   
	  for(attr in json){
		  curr=0;
		  if(attr=='opacity'){	
			  curr=Math.round(parseFloat(getStyle(obj,attr))*100);
			  }else{
			  curr=Math.round(parseInt(getStyle(obj,attr))); 	  
				  }   //  取属性值
 				  
		   speed=(json[attr]-curr)/time;
		   speed=speed>0?Math.ceil(speed):Math.floor(speed);  // 定义运动形式 及 初始化运动值
		   if(curr!=json[attr]) 
			   totalOk=false;
		   
		   if(attr=='opacity'){
				objStyle.filter='alpha(opacity:'+(curr+speed)+')';
				objStyle.opacity=(curr+speed)/100;
			   }else{
				objStyle[attr]=curr+speed+'px';  
				   }   		  //  计算运动  
				   
				   		  
		  } // end for/in 
		  //循环结束后  判断所有动画是否已经执行到位 如果到位  则关闭定时器  否则继续执行动画  不关闭定时器
		   if(totalOk){
			   clearInterval(obj.timer);
			   if(fnEnd) fnEnd();
			 }; 
		
		
		    
		  },time);
	  
	 }
	//  
  function trim(str){
	  return str.replace(/(^\s*)|(\s*$)/g,'');     // 简化写法 /^\s+$/
	  } 
	  
 // cookies
  function setCookie(name,value,iDay){
		 var oDate=new Date();
		 oDate.setDate(oDate.getDate()+iDay);
		 document.cookie=name+'='+value+';expires='+oDate;
		 }
  function getCookie(name){
		 var cookiePath=document.cookie.split("; ");
		 var i;
		 for(i=0;i<cookiePath.length;i++){
			var namePath=cookiePath[i].split('=');  //namePath -->  [name,value];
			if(namePath[0]==name){
				 return namePath[1];
				} 
			 };
		return '';  //什么都没设置时返回空
		}
  function removeCookie(name){
		 setCookie(name,'0',-1);   //-1表示 昨天 已经过期了  浏览器看到会马上删掉
		 }		 
 //数字加千分符
  function moneyChange(num){
		 num=num.toString();
		 var reg=/(?=(?!\b)(\d{3})+$)/g;  //  (?!\b) 反前向  表示 前面不能有空格(\b)的位置   ！\d{3} 数字{范围是3个}！ +$ 从尾部匹配起！  找到指定位置
		 return num.replace(reg,',');
		 }
		 
		 
	 //  class	
	 function isMember(total,sClass){
	  var classs=total.className;
	  var reg=new RegExp('\\b'+sClass+'\\b','i');
	  if(reg.test(classs)) return true;
	  return false;
	}
	 
function getClass(oParent,sClass){
	 var oattr=oParent.getElementsByTagName('*');
	 var elementBox=[];
	 for(var i=0;i<oattr.length;i++){
		  var total=oattr[i];
		  if(isMember(total,sClass)){
			  elementBox.push(oattr[i]);
			  }
		  
		 }
	  return elementBox;  
	}
	
// 模拟jquery的 addClass
  function hasClass(obj,className){
	  return obj.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
	  }
  function addClass(obj,className){
	  if(!hasClass(obj,className)) obj.className+=" "+className;
	  }	  
  function removeClass(obj,className){
	  if(hasClass(obj,className)){
		  var clsReg=new RegExp('(\\s|^)'+className+'(\\s|$)');
		  obj.className=obj.className.replace(clsReg,'');
		  } 
	  }
	  
	  
// 获取真实 offsetTop, offsetLeft
  function getTop(obj){
	 var ot=obj.offsetTop;
	 while(obj=obj.offsetParent){
		 ot+=obj.offsetTop; 
		 } 
	 	return ot;	 
	  }  
  function getLeft(obj){
	 var ol=obj.offsetLeft;
	 while(obj=obj.offsetParent){
		 ol+=obj.offsetLeft;
		 }	  
		return ol; 
	  }   
	  
	   	  	  
	  
//获取字符长度
 function getStrLen(str){
	   return String(str).replace(/[^\x00-\xff]/g,"aa").length;	
		}		  	