/**
 * Created by king on 2014/9/11.
 */
process.nextTick(function(){
    console.log('process.next延迟执行1');
});
process.nextTick(function(){
    console.log('process.next延迟执行2');
});

setImmediate(function(){
    console.log('setImmediate延迟执行1');
    process.nextTick(function(){
        console.log('process.next强势插入');
    });

});

setImmediate(function(){
    console.log('setImmediate延迟执行2');
});
console.log('正常执行');
