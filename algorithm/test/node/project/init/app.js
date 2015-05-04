
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var User = require('./model/user');
var Post = require('./model/post');
var MongoStore = require('connect-mongo')(express); // connect-mongo是将session存储到mongo中的工具类

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine','html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({  // cookie的set 和 get操作过程
    secret:'myNode', // 防止被篡改
    key : 'firstNode',  //cookie名称
    cookie : {maxAge : 1000*60*60*24*30,Secure : false},// 30天
    store : new MongoStore({  //存入的数据库
        db : 'firstNode'
    })
}));
app.use(express.bodyParser());  //  老方法,启动时会警告 但不会影响
app.use(app.router);// 用于定义 get post方法路由
app.use(express.static(path.join(__dirname, '/views')));

//app.use(function(req,res){
//    res.sendfile('./views/index.html');
//})

// development only
// 路由请求
app.get("/",function(req,res){
    res.sendfile('./views/index.html');
});
app.post('/',sendSession); // end

app.get("/api/regit",CheckNotLogin);  // 如果在已经登录的情况下，地址栏访问注册页面的话，直接跳转到首页
app.get("/api/regit",function(req,res){
    console.log("服务器根目录:" + __dirname + " : " + req.method + " : " + req.url)
    res.sendfile('./views/client.html');
});
app.get("/api/login",CheckNotLogin);
app.get("/api/login",function(req,res){
    res.sendfile('./views/login.html');
});
app.get("/api/logout",function(req,res){
     req.session.user = null;
     res.redirect('/');

});
//mongo.connect('mongodb://localhost:27017', function(err, conn){
//     console.log(conn);
//})  // 检测mongo是否正常连接，不正常的话为null
app.get('/api/user/:id',function(req,res,next){
    res.send('<b style="color: #FF1632;">' + req.params.id +'</b>' + "登录成功" + "<div><a href='/api/post'>发表文章</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='/'>返回首页</a></div>");
}); // end :id

app.get('/api/post',function(req,res){
    res.sendfile('./views/content.html')
}); // end

app.post('/api/post',sendSession); // end

app.post('/api/postSend',function(req,res){   // 文章发送
    var reqPost = {
        title: req.body.post_title,
        date : req.body.post_time,
        author : req.body.post_author,
        content : req.body.post_txt
    }

    var newPost = new Post(reqPost);
    newPost.save(function(err,status){
        if(err) return err;
        console.log('提交的内容' + status);
        res.send(status.content + "提交\r成功" + '<a href="/api/postShow">查看内容</a>');
    });
}); // end

app.get('/api/postShow',function(req,res){
    res.sendfile('./views/posts.html');
//    console.log('postShow')
//    var str = '';
//    Post.get(req.session.user.name,function(err,posts){
//        if(err) return err;
//        for(var i=0;i<posts.length;i++){
//            str += i + ':' + po拒绝 sts[i].content +'<br>';
//        }
//        res.send(str);
//    });
});










// POST处理
//响应注册
app.post("/api/regit",function(req,res){
    var user = {
        name : req.body.user,
        password : req.body.pwd
    }
    var newUser = new User(user);
    User.get(newUser.name,function(err,user){
         if(user){
             console.log('用户名已经存在')
             res.send('<div>' + user.name + '已经存在</div>' + '<a href="/">返回首页</a>');

         }else{ // 如果user为null
             newUser.save(function(err,status){  // status{"ok":1,"n":1}
                 if(err){
                     console.log(err)
                     return err;
                 }
                 req.session.user = status;
                 res.redirect('/api/login');
             });
         }  // end if -else


    });
    // 检查用户名是否重复

});

//响应登录
app.post("/api/login",function(req,res){
    var user = {
        name : req.body.user,
        password : req.body.pwd
    }
    User.get(user.name,function(err,user_doc){
         if(!user_doc){
             res.send('账户不存在');
             return err;
         }
        if(user.password !== user_doc.password){
             res.send('账户名或者密码错误');
        }else{
             req.session.user = user_doc;
             console.log( req.session.user)
             res.redirect('/api/user/' + user_doc.name);
        }
    })
//    res.send('登录成功');
});


// 检查是否登录的中间件
  function CheckNotLogin(req,res,next){
        if(req.session.user){
           console.log('已经登录');
           res.redirect('/');   //  如果已经登录的话 显示首页
        }
      next();
  }
  function sendSession(req,res,next){
       if(!req.session.user){
           console.log('user noLogin!');
           res.send({noLogin:1}); // 前后端分离： 这时候如果不告知前端返回了一个名称为noLogin的属性的话，前端将陷入可怕的DEBUG中....-_--
       }else {
           res.send(req.session.user);
       }
  }








if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
process.on('uncaughtException',function(e){
    console.log(e)
}); // 捕捉错误 ，防止直接当机