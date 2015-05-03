/**
 * Created by king on 2015/4/19.
 */
   var http = require('http');
   var EventEmitter = require('events').EventEmitter;
   var util = require('utils');
   var Server = function(){
       console.log('I m Server Class');
   };
   util.inherit(Server,EventEmitter);
   var s = new Server();
   s.emit('data',{data:"操你妈"});
   setTimeout(function(){
       s.on('data',function(d){
           console.log(d);
       })
   },3000);