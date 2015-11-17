// JavaScript Document
window.onload=function(){
//大图优化
var imgLoad=(function(){
 var imgBox=document.getElementById('topSlide');
 loadingInt(imgBox);	
 loadImg([
 	"res/images/slide/s-05.jpg",
	"res/images/slide/s-02.jpg",
	"res/images/slide/s-03.jpg",
	"res/images/slide/s-04.jpg",
	"res/images/slide/s-01.jpg"
 	],imgBox);
	})();
	
/*大图右侧 panel*/
var slidePanel=(function(){
	var oPanel=document.getElementById('rightPanel');
	var oArrowLi=document.getElementById('slideArrowLi');	
	var oArrow=document.getElementById('slideArrow');	
	var down_on=true;
	oArrow.style.WebKitTransform="rotate(180deg)";
	oArrowLi.onclick=function(){
		if(down_on){
		oArrow.style.transform="rotate(180deg)";
		oArrow.style.webkitTransform="rotate(180deg)";
		addClass(oPanel,"panel-opacity");
		startMove(oPanel,{top:-162});
		}else{
		oArrow.style.transform="rotate(0deg)";
		oArrow.style.webkitTransform="rotate(0deg)";
		startMove(oPanel,{top:-13},16.7,function(){
		removeClass(oPanel,"panel-opacity");	
			});	
			} // end if /=* down *=/
		down_on = !down_on;	
		}; // end onclick
	})();
	
	
	
/*轮播！~~@*/	
var slideMain=(function(){   // 重点 难点 ：：  文字与 图片的   index索引 要对应起来~~~~
	 var slideBox=document.getElementById('topSlideBox');
	 var slideBoxLi=slideBox.getElementsByTagName('li');
	 
	 var slideIndex=document.getElementById('topSlideIndex');
	 var slideIndexLi=slideIndex.getElementsByTagName('a');
	 
	 var slideInfoBox=document.getElementById('slideInfoInner');
	 var slideInfoItem=getClass(slideInfoBox,"s-info");
	 
     slideInfoItem[0].style.opacity=1;   // 初始化 文字和图片 的显示    
	 slideBoxLi[0].style.display="block";
	 slideBoxLi[0].style.opacity=1;
	 
	 var TS_now=0;
	 var f_time;
	

     for(var i=0;i<slideIndexLi.length;i++){
	     slideIndexLi[i].index=i;
		 slideIndexLi[i].onmouseover=function(){
			clearInterval(f_time);
			TS_now=this.index;
			indexSlide();
			 }
	     slideIndexLi[i].onmouseout=function(){
			 f_time=setInterval(nextPic,3500); 	 
			 }		 
		}
	 function nextPic(){
		 TS_now++;
		if(TS_now==slideBoxLi.length){
		 TS_now=0;
		}
		indexSlide();
		 } //end nextPic
	 f_time=setInterval(nextPic,3500); 
	 
	
	function indexSlide(){
	    	opaPic(slideIndexLi,slideBoxLi,"s_curr",TS_now);   
			startMove(slideInfoBox,{top:TS_now*-70})
			for(var i=0;i<slideInfoItem.length;i++){     // 所有的 
					startMove(slideInfoItem[i],{opacity:0});
				}
			startMove(slideInfoItem[TS_now],{opacity:100});	 // 当前
		}; // end indexSlide 
	})();
	
/*左侧轮播*/
  var sideSlide=(function(){
	  var s_now=0; 
	  slidePic("slidePic","slideIndex",s_now,"u_curr",2500,"slide"); 
	  })();

/*左侧轮播*/


/*选项卡*/
var indexTab=(function(){
	 var tCont=document.getElementById('tabCont')
	    ,tContItem=getClass(tCont,"tab-cont-item")
	    ,t_now=0;
	 tab_switch(tCont,tContItem,"tabBtn","li","t_curr",t_now); 
	})();	


	
/*遮罩 展示*/
var showGrid=(function(){
	var sMask=document.getElementById('listMaak')
	    ,sBox=document.getElementById("showBox")
		,sBoxItem=sBox.getElementsByTagName('li')
		,sListDiv=document.getElementById('showList')
		,i,length,zNow=2
		,scaleOn=false
		,itemWidth=sBoxItem[0].offsetWidth
		,itemHeight=sBoxItem[0].offsetHeight
		,itemMarginL=parseInt(getStyle(sBoxItem[0],"marginLeft"))
		,itemMarginB=parseInt(getStyle(sBoxItem[0],"marginBottom"))
		,scaleWidth=itemWidth*2+itemMarginL
		,scaleHeight=itemHeight*2+itemMarginB
		,len=sBoxItem.length
		,lastRight=sListDiv.offsetWidth-itemWidth
		,lastBottom=(sListDiv.offsetHeight-parseInt(getStyle(sListDiv,"marginTop"))+1)-itemHeight;

		sListDiv.style.height=sBoxItem[len-1].offsetTop+sBoxItem[len-1].offsetHeight+'px';  // 撑开父级高度
		

		for(i=0;i<len;i++){
		   sBoxItem[i].style.left=sBoxItem[i].offsetLeft+'px';
		   sBoxItem[i].style.top=sBoxItem[i].offsetTop+'px';
		   
		   sBoxItem[i].index=i;
		   sBoxItem[i].onmouseover=function(){  //暂时 找不到 e.target.index的方法  先给每个元素绑定事件
                scaleOn=true;
				sNow=this.index;
			
			    sMask.style.zIndex=zNow;
				this.style.zIndex=zNow++;
			   listScale(scaleOn,sNow);
			   } // end onmouseover
		 
		      
		 	} // end for
			
	   sBox.onmouseout=function(e){
			 var e = e || window.event;
			 scaleOn=false;
			 startMove(sMask,{opacity:0},16.7,function(){
					   sMask.style.display="none"; 
				 });
			  listScale(scaleOn,sNow)
		   }  // end onmouseout    	
		 	
	    for(i=0;i<len;i++){
			sBoxItem[i].style.position="absolute";
			sBoxItem[i].style.margin=0;	
			} // end for position  
		
	   function listScale(sOn,now){
		
			  if(sOn){ 
			       sMask.style.display="block"; 
				   startMove(sMask,{opacity:100});
				   startMove(sBoxItem[now],{width:scaleWidth,height:scaleHeight});
				   
				    if(sBoxItem[now].offsetLeft==lastRight){
				     startMove(sBoxItem[now],{width:scaleWidth,height:scaleHeight,marginLeft:-itemWidth-itemMarginL});   //end if --- >offsetLeft
				       }else if(sBoxItem[now].offsetTop==lastBottom){
					 startMove(sBoxItem[now],{width:scaleWidth,height:scaleHeight,marginTop:-itemHeight-itemMarginB});
					   }
				   if(now==(len-1)){
				     startMove(sBoxItem[now],{width:scaleWidth,height:scaleHeight,marginTop:-itemHeight-itemMarginB,marginLeft:-itemWidth-itemMarginL});
						   }
			
					   
	  				}else{
					  startMove(sBoxItem[sNow],{width:itemWidth,height:itemHeight});
				   
				     if(now == 7 || now == 15 || now == 23){ // 因为html架构的的错误 所以只能用土方法  正确的架构应该是 每行 应该是 对应一个 ul 而不是只有一个ul套上全部
				     startMove(sBoxItem[now],{width:itemWidth,height:itemWidth,marginLeft:0});   //end if --- >offsetLeft
				       }else if(now == len-8 || now == len-7 || now == len-6 || now == len-5 || now == len-4 || now == len-3 || now == len-2){   
					 startMove(sBoxItem[now],{width:itemWidth,height:itemWidth,marginTop:0});
					   }
				   if(now==(len-1)){
			
				     startMove(sBoxItem[now],{width:itemWidth,height:itemHeight,marginTop:0,marginLeft:0});
						   }	
						}// end if sOn 	
			   }; // end listScale
	
	})();	
};


