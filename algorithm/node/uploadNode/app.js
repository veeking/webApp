var express = require('express');
var http = require('http');
var path = require('path');
var qs = require('querystring');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'views')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/',function(req,res){
    res.sendfile('views/imgUp.html');
});
app.post('/api/files',function(req,res){
    var postData = '';  // formData === postData
    var chunks = [];
    var size = 0;
    req.on('data',function(chunk){   // 图片上传的chunck为二进制数据
        postData += chunk;  // 拼接二进制   chunk为CS端接收过来的formData数据
        chunks.push(chunk);
        size += chunks.length;
    })
    req.on('end',function(){
        console.log(size);
        var buf = Buffer.concat(chunks);
        var str = ioncv.decode(buf,'utf8');
        size += stream.length;
        console.log(buf.toString());
        res.send(postData)
        console.log(size);
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('服务运行中.... ' + app.get('port'));
});
