    var lastTime = 0;
    var vendors = ['ms','moz','webkit','o'];
    for(var i=0;i<vendors.length && !window.requestAnimationFrame;i++){
        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];  // 前缀兼容
        window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
    }

      // 低版本兼容
      if(!window.requestAnimationFrame){  // 如果个别浏览器不存在requestAni的API的话，自定义
          window.requestAnimationFrame = function(callback,element){
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0,16 - (currTime - lastTime)); //最佳间隔时间

              var id = window.setTimeout(function(){
                  callback(currTime + timeToCall);
              },timeToCall);

             lastTime = currTime + timeToCall;
             return id;
          }
      } // end !window.request

     if(!window.cancelAnimationFrame){ // 兼容
         window.cancelAnimationFrame = function(id){
             clearTimeout(id);
         }
     }
