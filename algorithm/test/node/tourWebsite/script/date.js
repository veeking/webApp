// JavaScript Document
/**日历  module ~~~!!  king !**/

   var date_Box=document.getElementById('searchBox'),
   	   date_Input=getClass(date_Box,"date-list"),

	   date_bb=getClass(date_Box,'db'),
	   dbLen=date_bb.length,
	   
	   date_Intime=document.getElementById('dateIn'),
	   date_Outtime=document.getElementById('dateOut'),  // 进/入 住日期box
	   
	   inSpan=date_Intime.getElementsByTagName('span'),
	   outSpan=date_Outtime.getElementsByTagName('span'),    // 上下月 按钮

	   aTd=date_Box.getElementsByTagName('td'),
	   i,inputLen=date_Input.length,
	   monthArr=['一','二','三','四','五','六','七','八','九','十','十一','十二']; 
	   
	   var dayNum=0;  // 每月天数  由于在其他函数也需要调用  所以设为了全局变量....
  	   var bBtn=true,
	   	   inp=true,
		   hiddOn=true;  // 显示 隐藏下拉框的判断变量
	   
	   var nowSelect=999;  // 当前选中的index位置记录 变量  
	   var nextSelect=999;
	   for(i=0;i<inputLen;i++){
		   date_Input[i].value='';
		   date_Input[i].index=i;
		   date_Input[i].onclick=function(ev){
			   var ev = ev || window.event;
			   for(i=0;i<dbLen;i++){
				 date_bb[i].style.display="none";
			   }
			   var oDate=new Date();
			   date_bb[this.index].style.display='block';
			   startMove(date_bb[this.index],{opacity:100});
			   

				showDate(date_Intime,oDate.getFullYear(),oDate.getMonth()+1,true);
				showDate(date_Outtime,oDate.getFullYear(),oDate.getMonth()+1);		   
			
				showColor(oDate.getDate());   // 可以用index 索引 和  父级 id来判断 点击的是哪个input
				showBtn(this.index);
				showClick();
				hideLastTr();
				ev.cancelBubble=true;
			 };  // end focus 	
	  
			   		 
					    
}// end for i onclick
 document.onclick=function(ev){
	var ev = ev || window.event;
	var oTarget= ev.srcElement || ev.target;
	
	 if(hasClass(oTarget,"date-btn-icon") ){  // 如果点击的是 日历按钮
		 hiddOn=false;	
		 }else{
		 hiddOn=true;
			 };
	 
	if(hiddOn){
	 hiddenBox();		
	if(placeList.style.display="block"){		
	   placeList.style.display="none";	
	}
	}// end if 
	
 };	 // end document.onclick 
			 
			 	 	
 function showDate(obj,year,month,bBtn){
	 var oDate=new Date();
	 var i,j;
	 
	 if(!obj.bBtn){  //  只允许生成第一次 
		obj.oTitle=document.createElement('div');// 头部 
		obj.oTitle.className='date-box-title';
		obj.appendChild(obj.oTitle);
		
		var oTable=document.createElement('table'); 
		oTable.className='date-calendar-ui';
		var oHead=document.createElement('thead');
		var oTr=document.createElement('tr');  //  周X
		
		var weekArr=['周一','周二','周三','周四','周五','周六','周日'];
		
		
		for(i=0;i<7;i++){
		  var oTh=document.createElement('th');
		  oTh.innerHTML=weekArr[i];
		  oTr.appendChild(oTh);
			} // end for
		 oHead.appendChild(oTr);
		 oTable.appendChild(oHead);   // 头部 
		 
		 
		 var tBody=document.createElement('tbody');
		 for(i=0;i<6;i++){    // 六行七列
			 var oTr=document.createElement('tr');
		   for(j=0;j<7;j++){	
		   	 var oTd=document.createElement('td');	
			 oTr.appendChild(oTd); 
		   		} // end for j
			tBody.appendChild(oTr);	
			 } // end for i
		 oTable.appendChild(tBody);
		 obj.appendChild(oTable);	 
		 obj.bBtn=true;  
		 }// end if	 
		 
	 obj.oTitle.innerHTML='<a href="###" class="date-btn-ui date-prev"><span class="date-btn-icon date-prev-icon">&lt;上月</span></a><a href="###" class="date-btn-ui date-next"><span class="date-btn-icon date-next-icon">下月&gt;</span></a><div class="date-title-ui"><span class="title-ui-year">'+year+'</span>年<span class="title-ui-month">'+monthArr[month-1]+'</span>月</div>';	 

	 var aTd=obj.getElementsByTagName('td');   // 每次点击先清空 , 再添加
	  for(i=0;i<aTd.length;i++){	
		aTd[i].innerHTML='';	 
		 } // end for

		 
	if(month==1 || month==3 || month==5 || month==7 || month==10 || month==12){   // 月份日数 闰年判断 
		dayNum=31;	
		}else if(month==4 || month==6 || month==9 || month==11){
		dayNum=30;	
		}else if(month==2 && isLeapYear(year)){
		dayNum=29;	
		}else{
		dayNum=28;	
		}	 
	
	oDate.setFullYear(year);
	oDate.setMonth(month-1);
	oDate.setDate(1);
	
	switch(oDate.getDay()){
	    case 0:
	   for(i=0;i<dayNum;i++){
		   aTd[i+6].innerHTML=i+1; 
		   }// end for
	   break;	
	    case 1:
	   for(i=0;i<dayNum;i++){
		   aTd[i].innerHTML=i+1; 
		   }// end for
	   break;	
	    case 2:
	   for(i=0;i<dayNum;i++){
		   aTd[i+1].innerHTML=i+1; 
		   }// end for
	   break;	
	    case 3:
	   for(i=0;i<dayNum;i++){
		   aTd[i+2].innerHTML=i+1; 
		   }// end for
	   break;	
	    case 4:
	   for(i=0;i<dayNum;i++){
		   aTd[i+3].innerHTML=i+1; 
		   }// end for
	   break;	
	    case 5:
	   for(i=0;i<dayNum;i++){
		   aTd[i+4].innerHTML=i+1; 
		   }// end for
	   break;
	    case 6:
	   for(i=0;i<dayNum;i++){
		   aTd[i+5].innerHTML=i+1; 
		   }// end for
	   break;	
		}; // end switch 	
	 
	 if(month==1 && bBtn){  //(等于1时  并且是当前日期 (bBtn=true) 当前月份 等于1 那么 上个月 12   下月为12 下下月应为 12   而不是 month+1 = 13
		obj.oTitle.getElementsByTagName('span')[3].innerHTML=12;
		 }else if(month==12 && !bBtn){
	    obj.oTitle.getElementsByTagName('span')[3].innerHTML=1;		 
			 }  
	
	 }; // end showDate()	   
		
 function isLeapYear(year){
	 if(year%4==0 && year%100!=0){   // 闰年判断： 1、当前年份除以4 没有余数 并且 除以 100  余数不为0
	  	 return true;	 
		 }else{
		 if(year%400==0){
			 return true; 
			 }else{
			 return false;	 
			 }	 
		 }
		 
	 } // end isLearYear
	 
 function showColor(date){
	  var res=[];
	  var oDate=new Date();
	 //该表达式在匹配有价格的日历时才用 var reg=new RegExp(''+date+'(<p>)*');
	  var index=0,
	      len=aTd.length;
		  
	  for(i=0;i<len;i++){
		  if(aTd[i].innerHTML!=''){
			  res.push(aTd[i]);	 
			  }
		  } // end for	
		  
	  	  
	  var rLen=res.length,
	  	  cashNum=0,
		  cashBtn=true;
	
		  
	  if(inSpan[2].innerHTML==oDate.getFullYear() && inSpan[3].innerHTML==monthArr[oDate.getMonth()] && outSpan[2].innerHTML==oDate.getFullYear() && outSpan[3].innerHTML==monthArr[oDate.getMonth()]){  //  当前年 ==  系统年   月== 系统月
		  
		   for(i=0;i<rLen;i++){ 
		   	   res[i].index=i;
			   if(res[i].innerHTML==date){   //如果日期 等于当前日期的话 那么.....
				  res[i].className='date-today';
				  index=i; 
				  if(cashBtn){   // 设变量开关  让cashNum只减一次, 在循环中只允许赋值一次  第二次为false 后就不执行了..
						cashNum=dayNum-index; 
						cashBtn=false;
						
					  } // if btn;
						 	
			 	  for(len=index+cashNum;index+1<len;index++){  // index+cashNum为当前日期加 当前以后日期 ,从这里开始循环 
					 res[index+1].className='date-current';
				   } // end for len
				 }  // end if reg
				
			  } // end for
			if(nowSelect!=999){     //为了不让其默认显示选中
			res[nowSelect].className="date-selected";
			  };
			if(nextSelect!=999){  
			res[nextSelect].className="date-selected";
			  };   

		   	   
			   	   
		  }else{
			for(i=0;i<res.length;i++){
				res[i].className='';	
				}  
			  }	 //  end  if(inSpan)   
	
	 } // end showColor	 

	 function showBtn(index){   // index 为 判断 用户点击的是 入住日期 还是 退房日期  1为入   0为退
	  var tMonth,
		  tYear;
	 	
	   if(typeof index === "number"){
	      if(index == 0){
		 tMonth=inSpan[3].innerHTML;
		 tYear=parseInt(inSpan[2].innerHTML);		 
		 }else if(index == 1){
	     tMonth=outSpan[3].innerHTML;
		 tYear=parseInt(outSpan[2].innerHTML);	 
			 };       
			
		    } // end typeof number
	
		 switch(tMonth){
			 case "一":
			 tMonth=1;
			 break; 
			 case "二":
			 tMonth=2;
			 break; 
			 case "三":
			 tMonth=3;
			 break; 
			 case "四":
			 tMonth=4;
			 break; 
			 case "五":
			 tMonth=5;
			 break; 
			 case "六":
			 tMonth=6;
			 break;
			 case "七":
			 tMonth=7;
			 break;
			 case "八":
			 tMonth=8;
			 break; 
			 case "九":
			 tMonth=9;
			 break; 
			 case "十":
			 tMonth=10;
			 break; 
			 case "十一":
			 tMonth=11;
			 break; 
			 case "十二":
			 tMonth=12;
			 break;

			 }
		inSpan[0].onclick=function(){
			inoutBtn =true;
		    prevDate(date_Intime,tYear,tMonth,index);
		
	      } // end click  
		inSpan[1].onclick=function(){
			inoutBtn =true;
			nextDate(date_Intime,tYear,tMonth,index);	
			}	
				
		outSpan[0].onclick=function(){
			inoutBtn =false;
		    prevDate(date_Outtime,tYear,tMonth,index);
		
	      } // end click  
		outSpan[1].onclick=function(){
				inoutBtn =false;
			nextDate(date_Outtime,tYear,tMonth,index);	
			}		
			 
		 } // end showBtn
		
		 
    function prevDate(time,year,month,index){
	  if(month == 1){
		   showDate(time,year-1,12,true); 
	    }else{
		   showDate(time,year,month-1);	
			}
		showBtn(index);
		showColor(new Date().getDate());
		hideLastTr();	
		};		
   function nextDate(time,year,month,index){
	  if(month == 12){
		   showDate(time,year+1,1); 
	    }else{
		   showDate(time,year,month+1,true);	
			}
		showBtn(index);
		showColor(new Date().getDate());
		hideLastTr();	
		};	// next prev ~~~--- 	
		
		
  function showClick(){
	  var re=/(\d+)((<p>)*)/;
	  var oDate=new Date(),
	  	  len=aTd.length;
      var arr=[];  // 保存不为空的  为了在点击时候 把正确的index值传给 nowSelect
	   for(i=0;i<len;i++){
		 if(aTd[i].innerHTML!=''){
			  arr.push(aTd[i]);	 
			 }	 
	   }  // end for
	   
	  var aLen=arr.length;    // aLen为 不为空的所有 数组对象  
	  for(i=0;i<aLen;i++){
		 arr[i].index=i;	 
		 arr[i].onclick=function(){
		    if(this.className=='date-current' || this.className=='date-today'){   // 当前的和 之后 才可以点击
			 for(i=0;i<aLen;i++){  // 选中样式
				removeClass(arr[i],'date-selected');
				}
				
			   addClass(this,'date-selected');
			   										// 如果点击的是第二个日期框(总数的一半为第二个);		
			   if(this.index > aLen/2){        	
			  	 if((oDate.getMonth()+2)==1){  //如果是一月的话 year +1 
				 	this.innerHTML.replace(re,function($0,$1){  // $1 为当前点击的值  也就是第几日
						date_Input[1].value=oDate.getFullYear()+1+'-'+(oDate.getMonth()+1)+'-'+$1;			
						});
					 }else{ 
					 this.innerHTML.replace(re,function($0,$1){
						date_Input[1].value=oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+$1; 
						 });
					 	}  // end getMonth()+1
					date_Outtime.style.display='none';// 点击之后 日历框 隐藏	
					nextSelect=this.index;	
			      }else{  // 如果点击的是第一个日期框的话		 
				   document.title=1; 
					  this.innerHTML.replace(re,function($0,$1){
						  date_Input[0].value=oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+$1; 
						  });		  
						date_Intime.style.display='none';// 点击之后 日历框 隐藏
				    nowSelect=this.index;	  
				  	}// end  aTd.length/2 
					
				
				bBtn=true;	
			   }// end if className == 'date-currten'		 
			 
			 }  // end onclick
		 } // end for i 
	   	 
	  } // end showClick	



function hideLastTr(){
   
	var emptyBtn=true;
	var emptyBtn2=true;
	
			if(aTd[35].innerHTML!=''){   //如果 最后一行的第一个元素是空的话（意味着最后一行没有内容）  那么将最后一行隐藏掉
				emptyBtn = false;
		  	   }
			if(aTd[77].innerHTML!=''){
				emptyBtn2 = false;
			   }	

	 if(emptyBtn){
		
		 for(i=35;i<42;i++){
			aTd[i].style.display='none';
			 } 
		 }else{
	 	 for(i=35;i<42;i++){
				aTd[i].style.display=''; 
		 	}
		 }// end if 
		
		
		if(emptyBtn2){
			for(var i=77;i<84;i++){
				aTd[i].style.display = 'none';
			}
		}
		else{
			for(var i=77;i<84;i++){
				aTd[i].style.display = '';
			}
		}	 // end if	
			  
	} // end hideLastTr	  		 
			 
			 
/*目前 bug  移出隐藏  和  保持选中状态*/   	 
	 
	 
/*城市选取*/
 var placeInput=document.getElementById('placeInput');
 var placeList=document.getElementById('placeList');
 var placeItem=placeList.getElementsByTagName('a');
 var pLen=placeItem.length;
 placeInput.value="";  // 刷新页面先清空
 placeInput.onclick=function(ev){
	var ev= ev || window.event;
	hiddenBox();
	placeList.style.display='block';
	ev.cancelBubble=true;
	 };
 

 	 
 for(i=0;i<pLen;i++){ 
		  placeItem[i].index=i;
		  placeItem[i].onclick=function(){
			 placeInput.value=placeItem[this.index].innerHTML; 
			 placeList.style.display='none';
			  }; 
	   }
	   
/*隐藏*/
function hiddenBox(){
for(i=0;i<dbLen;i++){
		startMove(date_bb[i],{opacity:0},10,function(){
			for(i=0;i<dbLen;i++){
			date_bb[i].style.display="none";
			}
			});
		
	} // end for i	
	} // end hiddenBox	   
	 