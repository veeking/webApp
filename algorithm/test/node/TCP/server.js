/**
 * Created by king on 2015/4/15.
 */
     var net = require('net');
     var server = net.createServer(function(socket){
         socket.on('data',function(msg){
                console.log(msg)
         })
         socket.on('end',function(){
             console.log('结束!!');
         })
         socket.write("欢迎您");
     });
   server.listen(2020,function(){
        console.log('listen is ok');
   });