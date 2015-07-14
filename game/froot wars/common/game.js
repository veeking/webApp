/**
 * Created by king on 2015/7/12.
 */

$(window).load(function(){

       game.init();
});

var loader = {
    loaded : true,
    loadedCount:0,  // 当前加载
    totalCount:0,  // 总共加载
    init : function(){
          //检查 支持的声音格式
        var mp3Support,oggSupport;
        var audio = document.createElement('audio');
        if(audio.canPlayType){
             mp3Support = "" != audio.canPlayType('audio/mpeg');
             oggSupport = "" != audio.canPlayType('audio/ogg;codecs = "vorbis"');
        }else{
            mp3Support = false;
            oggSupport = false;
        }
       loader.soundFileExtn = oggSupport?".ogg":mp3Support?".mp3":undefined;
    },
    loadImage:function(url){
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var image = new Image();
        image.src = url;
        image.onload = function(){
            loader.itemLoaded();
        };
        return image;
    },
    loadSound:function(url){
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        soundFileExtn:".ogg";// 后缀
        var audio = new Audio();
        audio.src = url + soundFileExtn;
        audio.addEventListener('canplaythrough',loader.itemLoaded,false);
        return audio;
    },
    itemLoaded:function(){
        loader.loadedCount++;  // 当前已加载++
        $('#loadingmessage').html('Loaded ' + loader.loadedCount + ' of ' + loader.totalCount); //显示加载进度
        if(loader.loadedCount == loader.totalCount){  //如果完成了加载
          loader.loaded = true;
          $('#loadingscreen').hide();
            //promise.resolve();
          if(loader.onload){
              loader.onload();
              loader.onload = undefined;  // onload只允许调用一次
          }
        }  // end count === total

    }

};

var game = {
    mode : 'intro',//游戏阶段   -  有限状态机
    slingshotX : 140,  // 弹弓的x和y坐标
    slingshotY : 280,
    maxSpeed:3,// 最大平移速度
    minOffset : 0,// 最小平移范围
    maxOffset : 300,
    offsetLeft:0, // 当前平移位置
    score : 0, //  游戏得分
    init : function(){  // 文档加载完成后的初始化操作
        loader.init();
        levels.init(); //  初始化关卡
        mouse.init();
        $('.gamelayer').hide();
        $('#gamestartscreen').show();

        game.canvas = $('#gamecanvas')[0];   //方便全局操作
        game.context = game.canvas.getContext('2d');
        $('#playGame').click(function(){
            game.showLevelScreen()
        });
    },
    showLevelScreen:function(){
        $('.gamelayer').hide();  // 点击play后 隐藏所有其他图层 显示关卡选择
        $('#levelselectscreen').show();
    },
    start:function(){
       $('.gamelayer').hide();
        // 显示游戏画布和得分
       $('#gamecanvas').show();
       $('#scorescreen').show();
        game.mode = "intro";
        game.offsetLeft = 0;
        game.ended = false;
        game.animationFrame = window.requestAnimationFrame(game.animate,game.canvas);
    },
    animate:function(){
        //mainloop
        // 移动背景
        game.handlePanning();

        //移动角色

        //视差滚动绘制背景
        game.context.drawImage(game.currentLevel.backgroundImage,game.offsetLeft/4,0,640,480,0,0,640,480); //game.offsetLeft/4表示X坐标不断移动
        game.context.drawImage(game.currentLevel.foregroundImage,game.offsetLeft,0,640,480,0,0,640,480);
        // 绘制弹弓

        game.context.drawImage(game.slingshotImage,game.slingshotX - game.offsetLeft,game.slingshotY);
        game.context.drawImage(game.slingshotFrontImage,game.slingshotX - game.offsetLeft,game.slingshotY);
            console.log('animate runing')
        if(!game.ended){  // 如果没有结束  则 继续调用动画
            game.animationFrame = window.requestAnimationFrame(game.animate,game.canvas);
        }
    },
    handlePanning:function(){
        if(game.mode == "intro"){  // 关卡刚刚载入
            if(game.panTo(700)){  //  如果平移回到中心点的话,状态机变为"是否有下一个英雄装弹弓"
                game.mode = 'load-next-hero';
            }
        } // end intro

        if(game.mode == "wait-for-firing"){  // 视野移回弹弓，准备发射
            if(mouse.dragging){  // 如果是"拖动事件"的话，画面中心平移回拖动点
               game.panTo(mouse.x + game.offsetLeft);
            }else{   //否则，画面中心平移到弹弓处
               game.panTo(game.slingshotX);
            }
        } // end wait-for-firing

        if(game.mode == "load-next-hero"){  // 检查是否有下一个英雄装弹弓
           //待完成
           // 检查是否有坏蛋活着,如果没有，结束关卡(通过)
           // 检查是否还有可装填的英雄，如果没有，结束关卡(失败)
           // 装填英雄，设置状态到 wait-for-firing
            game.mode = "wait-for-firing";
        } // end load-next-hero

        if(game.mode == "firing"){  // 已单击英雄，鼠标没释放和还没拖拽
           game.panTo(game.slingshotX);
        } // end firing
        if(game.mode == "fired"){  // 已释放按键并发射了英雄. 画面随之平移
              //待完成
              // 视野平移回英雄
        } // end fired
    },
    panTo : function(newCenter){ //画面中心移动到newCenter
        if(Math.abs(newCenter - game.offsetLeft - (game.canvas.width/4)) > 0 && game.offsetLeft <= game.maxOffset && game.offsetLeft >= game.minOffset){
            //  以下条件未被满足的话 继续平移
            // 1、当前offset如果没超过中心点的1/4
            // 2、当前offset小于max和大于min时
            var deltaX = Math.round((newCenter - game.offsetLeft - (game.canvas.width/4)) / 2);  // 让画布平移逐渐加快， 递增的速度变量
            if(deltaX && Math.abs(deltaX) > game.maxSpeed){  // 如果递增的速度大于最大速度值，则让其等于速度值
                deltaX = game.maxSpeed * Math.abs(deltaX) / (deltaX);
//                  deltaX = game.maxSpeed;
            }
            game.offsetLeft += deltaX;

        }else{
            return true;
        }  // end Math.abs

        if(game.offsetLeft < game.minOffset){  //检测平移是否超出范围
            game.offsetLeft = game.minOffset;
            return true;
        }else if(game.offsetLeft > game.maxOffset){
            game.offsetLeft = game.maxOffset;
            return true;
        } // end 边缘检测

        return false;
    }
};

var levels = { //  关卡对象
    data : [
        {  //  第一关
           foreground : 'desert-foreground',
           background:'clouds-background',
           entities:[]
        },
        {  //  第二关
            foreground : 'desert-foreground',
            background:'clouds-background',
            entities:[]
        },
    ],
    init : function(){
        var html = '';
        for(var i=0;i<levels.data.length;i++){  // 根据关卡数量生成关卡按钮
             var level = levels.data[i];
             html += '<input type="button" value="'+(i+1)+'"/>';
        } // end for levels

        $('#levelselectscreen').html(html);

        $('#levelselectscreen input').click(function(){
            levels.load(this.value - 1);  // 读取相应的关卡
            $('#levelselectscreen').hide();
        });
    },
    load:function(num){
        //声明新的当前关卡对象
        game.currentLevel = {number:num,hero:[]};  // 保存已加载的关卡数据
        game.score = 0;
        $('#score').html("Score:" + game.score);
        var level = levels.data[num]; // 特定的关卡数据
        //加载背景、前景和弹弓图像
        game.currentLevel.backgroundImage = loader.loadImage('./img/backgrounds/' + level.background + '.png');
        game.currentLevel.foregroundImage = loader.loadImage('./img/backgrounds/' + level.foreground + '.png');

        game.slingshotImage = loader.loadImage('./img/slingshot.png'); // 加载弹弓图像
        game.slingshotFrontImage = loader.loadImage('./img/slingshot-front.png'); // 加载弹弓图像
        //一旦所有的资源加载完成,调用start开始游戏

         loader.onload = game.start;  //因为资源加载是异步操作，所以需要 定义onload 方法为game.start的回调方法
            //  某个时刻(资源加载完成的时候)调用 game.start
            // 能不能用promise改装???
          // promise.then(function(){game.start()},function(){alert('失败了!!!')});
    }
};

var mouse = {    // 处理各种鼠标事件的对象
    x:0,   //  多处通用的变量写成全局
    y:0,
    down:false,
    init:function(){
        $('#gamecanvas').mousemove(mouse.mouseMoveHandler);
        $('#gamecanvas').mousedown(mouse.mouseDownHandler);
        $('#gamecanvas').mouseup(mouse.mouseUpeHandler);
        $('#gamecanvas').mouseout(mouse.mouseUpeHandler);
    },
    mouseMoveHandler:function(e){
        var offset = $('#gamecanvas').offset();
        mouse.x = e.pageX - offset.left;
        mouse.y = e.pageY - offset.top;   //  鼠标在画布的位置
        if(mouse.down){
            mouse.dragging = true;
        }
    },
    mouseDownHandler:function(e){
        mouse.down = true;
        mouse.downX = mouse.x;
        mouse.downY = mouse.y;
        e.preventDefault();
    },
    mouseUpHandler:function(e){
        mouse.down = false;
        mouse.dragging = false;
    }

}