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
    init : function(){  // 文档加载完成后的初始化操作
        loader.init();
        levels.init(); //  初始化关卡
        $('.gamelayer').hide();
        $('#gamestartscreen').show();

        game.canvas = $('#gamecanvas')[0];   //方便全局操作
        game.context = game.canvas.getContext('2D');

        $('#playGame').click(function(){
            game.showLevelScreen()
        });
    },
    showLevelScreen:function(){
        $('.gamelayer').hide();  // 点击play后 隐藏所有其他图层 显示关卡选择
        $('#levelselectscreen').show();
    },
    start:function(){
        alert('游戏开始!!');
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