
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/views')));

app.get('/',function(req,res){
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
var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
   clientBox.push(socket);
   console.log('一个客户端连接了' + clientBox[clientBox.length - 1]);

   socket.on('newClient',function(){
        socket.broadcast.emit('newNode',socket.id);
   });

   socket.on('clientData',function(e){
        // e.mx  e.my
       console.log(e.mx + ':' + e.my)
       socket.broadcast.emit('nodeData',{x:e.mx,y:e.my});
   });
});

