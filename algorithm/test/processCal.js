/**
 * Created by king on 2015/3/25.
 */


var x =0
    for (i = 0; i < 10000000000; i++)
    {
        x = i + x;
    }
   postMessage(x);
