/**
 * Created by king on 2015/4/15.
 */
    var net = require('net');
    var client = net.connect({port:2020},function(){
        console.log('客户端已经连接')
    });
    client.on('data',function(data){
            console.log(data);
            client.end();
    })
    client.on('end',function(){
        console.log('hello');
    });
