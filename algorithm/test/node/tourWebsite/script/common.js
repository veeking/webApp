
 /*~~~~~~~~! king ~~ module*/
 //公共模块交互函数库 
 function slidePic(sBox,iBox,now,cName,sTime,type,btnBox){   // sBox 为滑动父级, iBox为索引父级 , now 为当前索引 , cName为当前索引className ,sTime为间隔时间,  type为  滑动 和 透明度选项， btnBox为上下/张按钮
	 
        if(typeof sBox=="string"){
	    var slideBox=document.getElementById(sBox);
		}else if(typeof sBox=="object"){
		var slideBox=sBox;	
		}
       
		var slideGrid=slideBox.getElementsByTagName("li");
		var slideLen=slideGrid.length;
		var slideWidth=slideGrid[0].offsetWidth;
		
		if(typeof iBox=="string"){
		var indexBox=document.getElementById(iBox);
		}else if(typeof iBox=="object"){
		var indexBox=iBox;
			}
			
		var indexGrid=indexBox.getElementsByTagName("a");
		var indexLen=indexGrid.length;	 
		var i=0;
		var now=0;
		
	
	    //自动播放
	 var p=setInterval(next,sTime);
	
	  			  
	  function next(){
		    now++;
		    if(now==indexLen){
			   now=0;
			};
		 if(type=="slide"){
			 movePic(slideBox,indexGrid,slideWidth,cName,now);
			 }else if(type=="opacity"){
			 opaPic(indexGrid,slideGrid,cName,now);	 
				 }
		  };	
		  
		  
		for(i=0;i<indexLen;i++){
		indexGrid[i].index=i;
		indexGrid[i].onclick=function(){
		     now=this.index;
			 if(type=="slide"){
			 movePic(slideBox,indexGrid,slideWidth,cName,now);
			 }else if(type=="opacity"){
			 opaPic(indexGrid,slideGrid,cName,now);	 
				 }
			 }; 	 		 
		indexGrid[i].onmouseover=function(){
			clearInterval(p);	
			};
		indexGrid[i].onmouseout=function(){
			p=setInterval(next,sTime);	
			}				 
		       }; // end for
		
	
	
		  
		  
		  
	 if(btnBox && btnBox!=="undefined"){  //  有上\下按钮时
	    var s_btn=document.getElementById(btnBox);
		var s_btn_next=s_btn.getElementsByTagName('a')[0];
		var s_btn_prev=s_btn.getElementsByTagName('a')[1];
	    s_btn_next.onclick=function(){
	       next();
		  };
	    slideBox.onmouseover=function(){
		 	s_btn.style.display="block"; 
   			}
	    slideBox.onmouseout=function(){
			s_btn.style.display="none";		
			}		
		s_btn_next.onmouseover=function(){
				s_btn.style.display="block";
				 
  			}   
		s_btn_prev.onmouseover=function(){
				s_btn.style.display="block"; 
  			}   		  
	    s_btn_prev.onclick=function(){
		  if(now==0){
			now=0; 
			 }else{
			 now--;
			 if(type=="slide"){
			 movePic(slideBox,indexGrid,slideWidth,cName,now);
			 }else if(type=="opacity"){
			 opaPic(indexGrid,slideGrid,cName,now);	 
				 } // end if  type 
		 }
		 }	  	
		   };  // end btnBox;
	   
	 
	 }; // end slidePic
  
function tab_switch(tContBox,tCont,tBtnBox,tBtn,cName,now){
	  var tabBtnBox=document.getElementById(tBtnBox);
	  var tabBtn=tabBtnBox.getElementsByTagName(tBtn);
	  
	  var tabContBox=document.getElementById(tContBox);
	  
	  if(typeof tCont==="string"){      //如果传入的是一个标签名 那么直接获取标签.. 
		  var tabCont=tabContBox.getElementsByTagName(tCont);
		  }else if(typeof tCont=="object"){  //   如果传入的是一个对象 ,那么直接赋值 ,一般用于class获取
		  var tabCont=tCont; 
		  };
	  tabCont[0].style.display="block";	    // 第一个内容框 显示 
	  var now=0;
	  var i;
	  var len=tabBtn.length;
	  for(i=0;i<len;i++){
    		 
		 tabBtn[i].index=i;
		 tabBtn[i].onclick=function(){
			now=this.index;
			tab(cName,now,tabBtn,tabCont); 
			 } 
	  };
	
	};  // end tab
 
 //滚动固定
 function scrollFixed(obj,sTop,target,objTop){ 
   
	var oHeight=obj.offsetHeight
	    ,oLeft=getLeft(obj)
	    ,wHeight= document.documentElement.scrollHeight || document.body.scrollHeight;
	if(typeof target == "number"){  //   (侧边栏固定 )number 为 自身传的top值 如果在函数内 获取的话  top值会动态改变，我们要的是一个固定不变的值来做判断	
		target=target;	
		
		if(sTop >= (target)){   // 如果 元素超过 屏幕 一半过一点  则缩回去  以免触到 底部
			if(sTop >= (Math.floor(wHeight/1.6))){
				startMove(obj,{top:-obj.offsetHeight},16.67,function(){
				obj.style.position="static"; 
			      });
				}else{	
			obj.style.position="fixed";
			startMove(obj,{top:0});
			obj.style.left=oLeft+'px';
				 }
			   
		   }else{
		    obj.style.position="static";
				}// end if( > )
		
			
		}else if(typeof target=="object"){   // object 传来指定元素后 发生.....(吸顶导航)
	
	    target=getTop(target);
		
		if(sTop >= (target-oHeight)){
			
		   startMove(obj,{top:-oHeight},16.67,function(){
				obj.style.position="static";	
				  });	
				  
		  }else{
			  if(objTop) objTop;
			  if(sTop > objTop){                  
			    obj.style.position="fixed";	
			    startMove(obj,{top:0});
				
			  }else{
				obj.style.position="static";	  
				  }
			}// end if 
				
			}
	} // end scrollFixed() 	
 
 
 

 
 
 
 
 
 
 // 公用模块动画函数库
function tab(cName,now,tBtn,tCont){
		var i;
	    var len=tBtn.length;
		for(i=0;i<len;i++){
			tBtn[i].className="";
			tCont[i].style.display="none";
			}
			tBtn[now].className=cName;
			tCont[now].style.display="block";	
		};  
			
	
function opaPic(indexLi,slideLi,cName,now){
	  var i;
	  var len=indexLi.length;
	  slideLi[1].style.opacity=0;
	  slideLi[1].style.display="none";
	  for(i=0;i<len;i++){
		    indexLi[i].className='';
			slideLi[i].style.display='none';
			startMove(slideLi[i],{opacity:0});
		  }
		 startMove(slideLi[now],{opacity:100}); 
		 indexLi[now].className=cName;
		 slideLi[now].style.display='block';
	  };  
	  
	  
	  
  function movePic(slideBox,indexLi,liWidth,cName,now){
	 var i;
	 var len=indexLi.length;
	 for(i=0;i<len;i++){
		    indexLi[i].className='';
		  }
		 indexLi[now].className=cName;
		 startMove(slideBox,{left:-liWidth*now}); 
 		 };
		 

/*多个SELECT 函数*/    //当多个 下拉选框相互计算时，循环两次  i,j
function selectSum(sBox,total,price){
	  var selectBox=document.getElementById(sBox),
	      sItem=selectBox.getElementsByTagName('select'),
	  	  totalBox=document.getElementById(total),
		  i,j,len=sItem.length,
		  vipPrice;
		  if(typeof price=="string"){
		  vipPrice=parseInt(document.getElementById(price).innerHTML);
		  }		 
	  for(i=0;i<len;i++){
	
		sItem[i].index=i;
		sItem[i].options[0].selected=true; 
		sItem[i].onchange=function(){
			
		
		  var num=0;
		  for(j=0;j<len;j++){
		   if(typeof price=="object"){
			 vipPrice=parseInt(price[j].getElementsByTagName('i')[0].innerHTML);
		   }
			num+=parseInt(sItem[j].value)*vipPrice;
			
			}
			 
		  totalBox.innerHTML=num;	
		
		  }  
		 
		 } // end for i  
	 } // end selectSum		   		 
		 
		 

//大图加载优化
 function loadImg(url,imgBox){  // 用法   父级 obj  --- img 加上 class="loading标签"
		if(Object.prototype.toString.call(url) == "[object Array]" && url instanceof Array){  // 如果传入对象是数组的话(传入的对象必须是数组才能执行)
		if(url.length <= 0){  // 空数组的话 直接return函数 
		  alert("数组不能为空");
		  return;	
			} // if length
		 var srcArr=[],   //定义 一个用来保存路径的数组
		     i,uLen=url.length,img;
		 for(i=0;i<uLen;i++){
	  	    img = new Image();
			img.src=url[i];  //  默认加载使用 
	 		srcArr.push(url[i]);   // 插入图片路径使用
		   } // end for
		   
			img.onload=function(){   // 默认加载完成后 触发回调函数
				if(img.complete == true){
					showImg(img,imgBox,srcArr);
			  		} // end complete
			   };	
			img.onerror=function(){
			   alert("图片加载错误!!");      
			   };	
			
			   }else if(typeof url =="undefined"){
			   alert("参数不能为空!!");   
			   }else{
			   alert("传入对象应为数组Array!!"); 
				   } // end if Array
		   } // end loadImg
		   
  function showImg(obj,imgBox,listArr){
	  var imgList = imgBox.getElementsByTagName('img')
	  	  ,i,iLen=imgList.length;
	  for(i=0;i<iLen;i++){   // this
	  		removeClass(imgList[i],"loading"); //加载完成 为了不影响大图的显示 , 马上移除loading样式
	        imgList[i].src=listArr[i]; 
			imgList[i].style.opacity=0;
		    startMove(imgList[i],{opacity:100});		
	  		
		 } 
		 console.log(imgList[0].src);
   }// en showImg			 
		 
		 
 function loadingInt(bBox){
	  var imgs=bBox.getElementsByTagName('img'),
		  i,imgLen=imgs.length,
		  boxWidth=bBox.offsetWidth,
		  boxHeight=bBox.offsetHeight
		  leftCenter=Math.floor(boxWidth/2)-57,
		  topCenter=Math.floor(boxHeight/2)-57;   
		  
   for(i=0;i<imgLen;i++){	
   if(hasClass(imgs[i],"loading")){   // 利用class来判断当前class是否为loading(loading定义了居中样式),loading存在说明图片正在加载
   		var imgStyle=imgs[i].style;
		imgStyle.left=leftCenter+'px';
		imgStyle.top=topCenter+'px';
	   }
   	} // end for
	
		
	 };		 
		 
	  
	  
	  
	  	 
 