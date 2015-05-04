/**
 * Created by king on 2015/4/15.
 */
   var dgram = require('dgram');
   var message = new Buffer("第一次尝试");
   var client = dgram.createSocket('udp4');
   client.send(message,0,message.length,41234,"localhost",function(err,bytes){
        client.close();
   });
