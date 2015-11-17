
/**
 * drag app dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/')));

app.get('/',function(req,res){  //nginx里将proxy_http写成x.x.x.x/dragApp就可以了
    res.sendfile(__dirname + '/views/drag.html');
})
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
var clientBox = []; // 存放所有连接的客户端
//var movePos = {   初始化加载时用，目前不需要
//    x:0,
//    y:0
//};
var currIndex = 0; // 记录当前操作的元素索引，方便定位

var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
//   socket.emit('init',{x:movePos.x,y:movePos.y});
   clientBox.push(socket);
   console.log('一个客户端连接了,目前共有' + clientBox.length +'个客户端');

   socket.on('createDrag',function(data){
       io.sockets.emit('dragCreate',data);
   });

   socket.on('createScale',function(){
       console.log(currIndex)
       io.sockets.emit('scaleCreate',{index:currIndex});
   });
   socket.on('changeIndex',function(e){
       currIndex = e.index;
       console.log(currIndex)
       socket.broadcast.emit('indexChange',{index:currIndex,zIndex: e.zIndex});
   });
   socket.on('clientDragMove',function(e){
        // e.mx  e.my
//        movePos.x = e.mx;
//        movePos.y = e.my;
        socket.broadcast.emit('dragMove',{x:e.mx,y: e.my});
   });     // currIndex能不能只发送一次？

   socket.on('clientScaleMove',function(e){
       socket.broadcast.emit('scaleMove',{scaleX:e.sx,scaleY: e.sy});
   })

   socket.on('deleteScale',function(){
        io.sockets.emit('scaleDelete');
    });

   socket.on('disconnect',function(){
        clientBox.pop();
   });
});

