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
        var currentTime = new Date().getTime();
        var timeStep;
        if(game.lastTime){
           timeStep = (currentTime - game.lastTime) / 1000;  //  毫秒换成 秒
           box2d.step(timeStep);  // 取差作为timeStep
        }
        game.lastTime = currentTime;



        //视差滚动绘制背景
        game.context.drawImage(game.currentLevel.backgroundImage,game.offsetLeft/4,0,640,480,0,0,640,480); //game.offsetLeft/4表示X坐标不断移动
        game.context.drawImage(game.currentLevel.foregroundImage,game.offsetLeft,0,640,480,0,0,640,480);
        // 绘制弹弓
        game.context.drawImage(game.slingshotImage,game.slingshotX - game.offsetLeft,game.slingshotY);
        // 绘制所有物体
        game.drawAllBodies();
        // 绘制前置弹弓，为了实现 遮挡英雄 效果
        game.context.drawImage(game.slingshotFrontImage,game.slingshotX - game.offsetLeft,game.slingshotY);
        console.log('animate runing')

        if(!game.ended){  // 如果没有结束  则 继续调用动画
            game.animationFrame = window.requestAnimationFrame(game.animate,game.canvas);
        }
    },
    drawAllBodies:function(){
        box2d.world.DrawDebugData();
        //  遍历所有物体，并在游戏画布上绘制出来
        for(var body = box2d.world.GetBodyList();body;body = body.GetNext()){
            var entity = body.GetUserData();
            if(entity){
                var entityX = body.GetPosition().x*box2d.scale;
                if(entityX < 0 || entityX > game.currentLevel.foregroundImage.width || entity.health && entity.health < 0){ // 如果超出界限的话和生命值小于0的话 移除
                     box2d.world.DestroyBody(body);
                    if(entity.type == "villain"){
                       game.score += entity.calories; // 得分计算为 敌人的卡路里值
                       $('#score').html("Score : " + game.score);
                    }
                }else{
                    entities.draw(entity,body.GetPosition(),body.GetAngle());
                }   // end entityX < 0
            } // // end if entity
        }

    },
    countEntities:function(){  // 统计英雄和坏蛋的数量
        game.heroes = [];
        game.villains = [];
        for(var body = box2d.world.GetBodyList();body;body = body.GetNext()){
            var entity = body.GetUserData();
            if(entity){
                if(entity.type == "hero"){
                    game.heroes.push(body);
                }else if(entity.type == "villain"){
                    game.villains.push(body);
                }
            }
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
                if(game.mouseOnCurrentHero()){
                   game.mode = "firing";
                }else{
                    game.panTo(mouse.x + game.offsetLeft);
                } // end mouseOn
            }else{   //否则，画面中心平移到弹弓处
               game.panTo(game.slingshotX);
            }
        } // end wait-for-firing

        if(game.mode == "load-next-hero"){  // 检查是否有下一个英雄装弹弓
           game.countEntities();
           // 检查是否有坏蛋活着,如果没有，结束关卡(通过)
            if(game.villains.length == 0){
               game.mode = "level-success";
                return;
            }
            if(game.heroes.length == 0){
                game.mode = "level-failure";
                return;
            }
           // 检查是否还有可装填的英雄，如果没有，结束关卡(失败)
           // 装填英雄，设置状态到 wait-for-firing
            if(!game.currentHero){
                game.currentHero = game.heroes[game.heroes.length-1];
                game.currentHero.SetPosition({x:180/box2d.scale,y:200/box2d.scale});
                game.currentHero.SetLinearVelocity({x:0,y:0});
                game.currentHero.SetAngularVelocity(0);
                game.currentHero.SetAwake(true);
            }else{
                game.panTo(game.slingshotX);
                if(!game.currentHero.IsAwake()){
                    game.mode = "wait-for-firing";
                }
            }
        } // end load-next-hero
        if(game.mode == "firing"){  // 已单击英雄，鼠标没释放和还没拖拽
           if(mouse.down){  // 如果按下鼠标
             game.panTo(game.slingshotX);
               // 将英雄位置设为 鼠标处
               console.log("is down")
             game.currentHero.SetPosition({x:(mouse.x + game.offsetLeft)/box2d.scale,y:mouse.y/box2d.scale});
           }else{  // 如果松开后
              game.mode = "fired";
              var impulseScaleFactor = 0.75;  // 英雄推力倍数
              // 弹弓顶部和英雄顶部的距离的x和y向量 * 推力倍数
              var impulse = new b2Vec2((game.slingshotX + 35 - mouse.x - game.offsetLeft) * impulseScaleFactor,(game.slingshotY + 25 - mouse.y) * impulseScaleFactor);  // 加上推力
              game.currentHero.ApplyImpulse(impulse,game.currentHero.GetWorldCenter()); // 应用推力
           }
        } // end firing

        if(game.mode == "fired"){  // 已释放按键并发射了英雄. 画面随之平移
              //跟随当前英雄移动画面
            var heroX = game.currentHero.GetPosition().x * box2d.scale;
            // 视野平移回英雄
            game.panTo(heroX);
            // 直到该英雄停止移动或移除边界
            if(!game.currentHero.IsAwake() || heroX < 0 || heroX >game.currentLevel.foregroundImage.width){
                 // 然后删除旧的英雄
                box2d.world.DestroyBody(game.currentHero);
                game.currentHero = undefined;
                //加载下一个英雄
                game.mode = "load-next-hero";
            }
        } // end fired

       if(game.mode == "level-success" || game.mode == "level-failure"){
           if(game.panTo(0)){
               game.ended = true;
               game.showEndingScreen();
           }
       }

    },
    panTo : function(newCenter){ //画面中心移动到newCenter

        //移回中心点
        if(Math.abs(newCenter - game.offsetLeft - (game.canvas.width/4)) > 0 && game.offsetLeft <= game.maxOffset && game.offsetLeft >= game.minOffset){
            //  以下条件未被满足的话 继续平移
            // 1、当前offset如果没超过中心点的1/4
            // 2、当前offset小于max和大于min时
            var deltaX = Math.round((newCenter - game.offsetLeft - (game.canvas.width/4)) / 2);  // 让画布平移逐渐加快， 递增的速度变量
            if(deltaX && Math.abs(deltaX) > game.maxSpeed){  // 如果递增的速度大于最大速度值，则让其等于速度值
                deltaX = game.maxSpeed * Math.abs(deltaX) / (deltaX);
            }
            game.offsetLeft += deltaX;

        }else{
            return true;
        }  // end Math.abs

        // 边缘检测
        if(game.offsetLeft < game.minOffset){  //检测平移是否超出范围
            game.offsetLeft = game.minOffset;
            return true;
        }else if(game.offsetLeft > game.maxOffset){
            game.offsetLeft = game.maxOffset;
            return true;
        } // end 边缘检测

        return false;
    },
    mouseOnCurrentHero : function(){  //检测鼠标是否在当前英雄上
       if(!game.currentHero){
           return false;
       };
       var position = game.currentHero.GetPosition();
        //计算 当前英雄中心与鼠标之间的距离
       var distanceSquared = Math.pow(position.x * box2d.scale - mouse.x - game.offsetLeft,2) + Math.pow(position.y*box2d.scale - mouse.y,2);
       // 计算 英雄的半径
       var radiusSquare = Math.pow(game.currentHero.GetUserData().radius,2);
       return (distanceSquared <= radiusSquare);  //距离如果小于半径 则 鼠标悬停在英雄上
    },
    showEndingScreen : function(){
        if(game.mode == "level-success"){  // 成功过关
           if(game.currentLevel.number < levels.data.length - 1){ //不是最后一关时
              $("#endingMessage").html("成功过关 ！！");
              $("#playNextLevel").show();
           }else{
              $("#endingMessage").html("全部的关卡已经完成!!恭喜");
              $("#playNextLevel").hide();
           } // end number
        }else if(game.mode =="level-failure"){
              $("#endingMessage").html("失败了，请重新开始游戏");
              $("#playNextLevel").hide();
        } // end level-success
        $("#endingScreen").show();
    }
};

var levels = { //  关卡对象
    data : [
        {  //  第一关
           foreground : 'desert-foreground',
           background:'clouds-background',
           entities:[
               {type : "ground",name : "dirt",x:500,y:440,width:1000,height:20,isStatic:true},
               {type : "ground",name : "wood",x:180,y:390,width:40,height:80,isStatic:true},

               {type : "block",name : "wood",x:520,y:380,angle:90,width:100,height:25},
               {type : "block",name : "glass",x:520,y:280,angle:90,width:100,height:25},
               {type : "villain",name : "burger",x:520,y:205,calories:590},

               {type : "block",name : "wood",x:620,y:380,angle:90,width:100,height:25},
               {type : "block",name : "glass",x:620,y:280,angle:90,width:100,height:25},
               {type : "villain",name : "fries",x:620,y:205,calories:420},

               {type : "hero",name : "orange",x:60,y:405},
               {type : "hero",name : "apple",x:120,y:405},
           ]
        },
        {  //  第二关
            foreground : 'desert-foreground',
            background:'clouds-background',
            entities:[
                {type : "ground",name : "dirt",x:500,y:440,width:1000,height:20,isStatic:true},  // 弹弓和地面
                {type : "ground",name : "wood",x:180,y:390,width:40,height:80,isStatic:true},

                {type : "block",name : "wood",x:820,y:380,angle:90,width:100,height:25},
                {type : "block",name : "wood",x:720,y:380,angle:90,width:100,height:25},
                {type : "block",name : "wood",x:620,y:380,angle:90,width:100,height:25},
                {type : "block",name : "glass",x:670,y:255,angle:90,width:100,height:25},
                {type : "block",name : "glass",x:770,y:255,angle:90,width:100,height:25},
                {type : "block",name : "glass",x:670,y:318,width:100,height:25},
                {type : "block",name : "glass",x:770,y:318,width:100,height:25},
                {type : "block",name : "wood",x:720,y:193,width:100,height:25},

                {type : "villain",name : "burger",x:715,y:155,calories:590},
                {type : "villain",name : "fries",x:670,y:405,calories:420},
                {type : "villain",name : "sodacan",x:765,y:405,calories:150},

                {type : "hero",name : "strawberry",x:25,y:415},
                {type : "hero",name : "orange",x:70,y:405},
                {type : "hero",name : "apple",x:125,y:405},
            ]
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
        // 关卡加载时 ，初始化box2d世界
        box2d.init();
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
        //加载所有物体
        for(var i=level.entities.length - 1;i >= 0;i--){
            var entity = level.entities[i];
            entities.create(entity);
        };

         loader.onload = game.start;  //因为资源加载是异步操作，所以需要 定义onload 方法为game.start的回调方法
            //  某个时刻(资源加载完成的时候)调用 game.start
            // 能不能用promise改装???
          // 1 promise.then(function(){game.start()},function(){alert('失败了!!!')});
    }
};

var mouse = {    // 处理各种鼠标事件的对象
    x:0,   //  多处通用的变量写成全局
    y:0,
    down:false,
    init:function(){
        $('#gamecanvas').mousemove(mouse.mouseMoveHandler);
        $('#gamecanvas').mousedown(mouse.mouseDownHandler);
        $('#gamecanvas').mouseup(mouse.mouseUpHandler);
        $('#gamecanvas').mouseout(mouse.mouseUpHandler);
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

};

var entities = {  // 定义物体类型, 物体(玻璃、木材和地面)、英雄和坏蛋(橙子、苹果和汉堡)
    definitions:{
        "glass":{
            fullHealth:100,
            density:2.4,
            friction:0.4,
            restitution:0.15
        },
        "wood":{
            fullHealth:500,
            density:0.7,
            friction:0.4,
            restitution:0.4
        },
        "dirt":{
            density:3.0,
            friction:1.5,
            restitution:0.2
        },
        "burger":{
            shape:"circle",
            fullHealth:40,
            radius:25,
            density:1,
            friction:0.5,
            restitution:0.4
        },
        "sodacan":{
            shape:"rectangle",
            fullHealth:80,
            width:40,
            height:50,
            density:1,
            friction:0.5,
            restitution:0.7
        },
        "fries":{
            shape:"rectangle",
            fullHealth:50,
            width:40,
            height:50,
            density:1,
            friction:0.5,
            restitution:0.6
        },
        "apple":{
            shape:"circle",
            radius:25,
            density:1.5,
            friction:0.5,
            restitution:0.4
        },
        "orange":{
            shape:"circle",
            radius:25,
            density:1.5,
            friction:0.5,
            restitution:0.4
        },
        "strawberry":{
            shape:"circle",
            radius:15,
            density:2.0,
            friction:0.5,
            restitution:0.4
        }
    },
    create : function(entity){ // 以物体作为参数，创建一个Box2d物体，并加入世界
          var definition = entities.definitions[entity.name];
          if(!definition){
              console.log('未知的实体名');
              return;
          };
        switch(entity.type){
            case 'block' : // 简单的矩形
               entity.health = definition.fullHealth;
               entity.fullHealth = definition.fullHealth;
               entity.shape = "rectangle";
               entity.sprite = loader.loadImage("./img/entities/" + entity.name + ".png");
               box2d.createRectangle(entity,definition);
               break;
            case 'ground' : // 简单的矩形  : 地面
                // 不可摧毁的物体 ， 无生命体
               entity.shape = "rectangle";
                // 不会被画出，所以不具有图像
               box2d.createRectangle(entity,definition);
               break;
            case 'hero' : // 简单的圆
            case 'villain' : // 可以是圆形或是矩形 : 坏蛋
                entity.health = definition.fullHealth;
                entity.fullHealth = definition.fullHealth;
                entity.shape = definition.shape;
                entity.sprite = loader.loadImage("./img/entities/" + entity.name + ".png");

                if(definition.shape == "circle"){
                    entity.radius = definition.radius;
                    box2d.createCircle(entity,definition);
                }else if(definition.shape == "rectangle"){
                    entity.width = definition.width;
                    entity.height = definition.height;
                    box2d.createRectangle(entity,definition);
                }
                break;
            default :
                console.log('未知的实体');
                break;
        };
    },
    draw : function(entity,position,angle){// 以物体、物体的位置和角度作为参数，在画面中绘制物体 (重点和难点)
            // 以物体及其位置、角度为参数，将其绘制在游戏canvas上
          game.context.translate(position.x * box2d.scale - game.offsetLeft,position.y * box2d.scale);
          game.context.rotate(angle);  // 将 绘图环境 平移并旋转到物体的位置和角度
          switch(entity.type){  // 根据物体的类型和形状将其在canvas上绘制出来
              case "block" :
                  game.context.drawImage(entity.sprite,0,0,entity.sprite.width,entity.sprite.height,-entity.width/2-1,-entity.height/2-1,entity.width+2,entity.height+2);
                  break;
              case "villain":
              case "hero" :
                  if(entity.shape == "circle"){
                      game.context.drawImage(entity.sprite,0,0,entity.sprite.width,entity.sprite.height,-entity.radius-1,-entity.radius-1,entity.radius*2+2,entity.radius*2+2);
                  }else if(entity.shape == "rectangle"){
                      game.context.drawImage(entity.sprite,0,0,entity.sprite.width,entity.sprite.height,-entity.width/2-1,-entity.height/2-1,entity.width+2,entity.height+2);
                  } // end if
                  break;
              case "ground":
                  // 什么都不做  我们单独绘制地面和弹弓
                  break;
          } // end swith
        //最后，将绘图环境逆时针旋转至初始位置
        game.context.rotate(-angle);
        game.context.translate(-position.x*box2d.scale + game.offsetLeft,-position.y*box2d.scale);
    }
};

