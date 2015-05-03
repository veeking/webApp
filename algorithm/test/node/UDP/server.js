/**
 * Created by king on 2015/4/15.
 */
  var dgram =require('dgram');
  var server = dgram.createSocket('udp4');
  server.on("message",function(msg,rinfo){
      console.log(msg + " : " + rinfo);
  });
  server.on('listening',function(){
      var address = server.address();
      console.log(address);
  })
  server.bind(41234);