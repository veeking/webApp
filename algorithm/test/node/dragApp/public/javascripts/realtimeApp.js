/**
 * 小demo dragApp v1.00000000000000000000
 */
'use strict'
function DragApp(opt){  // 无需外部调用任何方法 ， 传参数后即可内部完成所有功能
    if(typeof opt != Object && opt == null){
        return false;
    }
    var url = window.location.protocol+'//'+window.location.host;
    var socket = io.connect(url); // 注意修改成服务器地址
    socket.on('indexChange',function(e){
        nowIndex = e.index;
        eleLayoutIndex = e.zIndex;  // 改变全局 zIndex
        eleBox[nowIndex].style.zIndex = e.zIndex;
    });
    socket.on('dragMove',function(e){  // 其它客户端需要移动才会触发 why?
        //  获取当前索引
        move(eleBox[nowIndex],{left: e.x,top: e.y});  //  点击切换时 必须要发送一次emit，但是数据？
    });
    socket.on('scaleMove',function(e){
        var w = scaleBox.offsetWidth + e.scaleX;
        var h = scaleBox.offsetHeight  + e.scaleY;
        //缩放 边缘检测
        move(scaleBox,{width:w,height:h});
        eleBox[nowIndex].style.width = eleBox[nowIndex].offsetWidth + (scaleBox.offsetWidth - eleBox[nowIndex].offsetWidth) - targetSpacing - 10 + 'px'; //要减掉多余的targetSpacing间距
        eleBox[nowIndex].style.height = eleBox[nowIndex].offsetHeight + (scaleBox.offsetHeight - eleBox[nowIndex].offsetHeight) - targetSpacing - 10 + 'px'; // 10
    })
    socket.on('dragCreate',function(attrData){
        createEle(attrData);
    });

    socket.on('scaleCreate',function(e){
        createScale(eleBox[e.index]);
        if(hasCreate){  // 元素生成后才可以拖拽、删除
            scaleBox.addEventListener(eventType.down,function(e){  // 按下启动拖拽
                document.addEventListener(eventType.move,startScale);
                document.addEventListener(eventType.end,function(){
                    document.removeEventListener(eventType.move,startScale);
//                    console.log('缩放结束，你可以做点什么...');
                    // 缩放结束时 要做的事 -> [检测 最大/最小值]
                });
                e.preventDefault();
                e.stopPropagation(); // 取消冒泡  防止与document的点击事件冲突ss
            });// end scaleBox down

        }  //  if hasCreate;
    });
    socket.on('scaleDelete',function(){
        deleteScale();
    });
    socket.on('error',function(){
        alert('socket服务器开小差!');
    });
    // socket监听区域

    // 公共属性 外部可获取
    var showView  = opt.showBox;
    var createBtn = opt.showBtn;
    var touchStartX = 0;
    var touchStartY = 0;
    var touchLeft = 0;
    var touchTop = 0;
    var scaleBox;  //  生成的拖动元素
    var hasCreate = false;  // 只允许元素生成一次

    var targetSpacing = showView.offsetWidth / 64 ;   //  拖动元素的 间距(与内元素的间距)  和  宽高
    var targetSize = showView.offsetWidth / 4;

    var currentEle = null; // 默认为空
    var eleBox = []; // 存放所有生成的元素

    var eleLayoutIndex = 1;
    var lastIndex = -1; //  -1是为了不让其与当前的index相等
    var nowIndex = 0;

    var longTime = null;
    var scaleOn = true;

    var isPc = isPc();
    var eventType = {
        down : (isPc?"mousedown":"touchstart"),  // 多次重复判断 是否有修改的余地？
        move : (isPc?"mousemove":"touchmove"),
        end : (isPc?"mouseup":"touchend")
    };
    createBtn.addEventListener(eventType.down,function(){
        var colorTotal = ['#373948','#F2405B','#F1C40F','#E77E23','#2FCC71','#3598DC','#9C59B8'];
        var uniAttr = {   // 以下的属性都是需要多客户端统一的
            coord : getCoord(targetSize), // 所以 发由服务器进行统一返回
            color : colorTotal[Math.floor(Math.random() * colorTotal.length)],
            class : 'newEle'
        };
        socket.emit('createDrag',uniAttr);
    });
    function createEle(attr){
        var i;
        // 创建
        try {
            var newEle = document.createElement('div');
            newEle.style.width = targetSize + 'px';  // 大小是根据由客户端来计算 不同大小的客户端大小也不一样
            newEle.style.height = targetSize + 'px';
            if(attr.coord.x > showView.offsetWidth - targetSize){  // 解决大窗口的客户端元素生成在小窗口里会溢出的问题
                attr.coord.x  = showView.offsetWidth - targetSize;
            };
            if(attr.coord.y > showView.offsetHeight - targetSize){
                attr.coord.y = showView.offsetHeight - targetSize;
            }
            newEle.style.left = attr.coord.x + 'px';
            newEle.style.top = attr.coord.y + 'px';
            newEle.style.background = attr.color;
            newEle.setAttribute('class', attr.class);
            eleBox[eleBox.length] = newEle;  // 把新元素推进数组，方便后续操作
            showView.appendChild(newEle);
        }catch(e){
            alert('创建元素时出现了个错误' + e);
        }; // end try
//        console.log(eleBox)
        socket.emit('deleteScale');  // 创建新元素时， 删除拖拽 并让current为最新生成的元素
        currentEle = eleBox[eleBox.length - 1];

        for(i = 0;i < eleBox.length;i++){
            eleBox[i].index = i;  // 定义索引
            eleBox[i].addEventListener(eventType.down,startDown);
        } // end for

        document.addEventListener(eventType.down,function(){
            socket.emit('deleteScale');
        });

        currentEle.addEventListener(eventType.down,function(){
            var longTimeCount = 0; // 长按计时器
            if(scaleOn){
                socket.emit('deleteScale');  // 每次点击切换时，先删除旧的，再在新的当前元素生成新的
                longTimeCount = 0; //  点击时 恢复  默认
                longTime = setInterval(function(){  //  应该是没有移动的情况下点击
//                    console.log('setInterval运行了');
                    longTimeCount++;
                    if(longTimeCount >= 10){
                        socket.emit('createScale'); // 同步给服务器创建scale
                        clearInterval(longTime); // 因为其他客户端是立即生成的 没有启动setInterval所以清除仅限于当前客户端
                    }
                },60);
            }  // if scaleOn
            currentEle.addEventListener(eventType.end,function(){
                clearInterval(longTime);
            })
        });  // end currentEle down

    }; // end function createEle()
    function startDown(e){
        scaleOn = true;
        currentEle = this;
        if(lastIndex != currentEle.index){ // 防止重复触发
            socket.emit('changeIndex',{index:currentEle.index,zIndex:eleLayoutIndex});
        };
        lastIndex = this.index;
        currentEle.style.zIndex = ++eleLayoutIndex;
        touchStartX = (isPc?e.clientX:e.touches[0].clientX);
        touchStartY = (isPc?e.clientY:e.touches[0].clientY);
        touchLeft = currentEle.offsetLeft;
        touchTop = currentEle.offsetTop;
        document.addEventListener(eventType.move,startMove);
        document.addEventListener(eventType.end,startEnd);
        e.stopPropagation();
        e.preventDefault();
    }

    function startMove(e){
        if(hasCreate){
            socket.emit('deleteScale');
            //  移动时清除缩放元素
        }
        clearInterval(longTime);
        var moveX = (isPc?e.clientX:e.touches[0].clientX);
        var moveY = (isPc?e.clientY:e.touches[0].clientY);
        var mx = touchLeft + (moveX-touchStartX);
        var my = touchTop + (moveY-touchStartY);
        // 边缘检测
        move(currentEle,{left:mx,top:my});
        socket.emit('clientDragMove',{mx:mx,my:my}); //  服务端交互 :很卡顿
        //元素顶部拖拽
    }

    function startEnd(){
        scaleOn = true;
        document.removeEventListener(eventType.down,startDown);  // 解绑
        document.removeEventListener(eventType.move,startMove);
        console.log('event is end');
    }

    function startScale(e){  // offsetLeft是showView里计算的，正常情况下是从document下计算的
        var moveX = (isPc?e.clientX:e.touches[0].clientX);
        var moveY = (isPc?e.clientY:e.touches[0].clientY);
        var scaleX = moveX - scaleBox.offsetWidth - (scaleBox.offsetLeft + showView.offsetLeft);
        var scaleY = moveY - scaleBox.offsetHeight - (scaleBox.offsetTop + showView.offsetTop);
        socket.emit('clientScaleMove',{sx:scaleX,sy:scaleY});
        var w = scaleBox.offsetWidth + scaleX;
        var h = scaleBox.offsetHeight + scaleY;
        //缩放 边缘检测
        move(scaleBox,{width:w,height:h});
        // 缩放元素跟着外层元素的大小来变化大小
        currentEle.style.width = currentEle.offsetWidth + (scaleBox.offsetWidth - currentEle.offsetWidth) - targetSpacing - 10 + 'px'; //要减掉多余的targetSpacing间距
        currentEle.style.height = currentEle.offsetHeight + (scaleBox.offsetHeight - currentEle.offsetHeight) - targetSpacing - 10 + 'px'; // 10PX为拖拽元素的边框 要减掉
        return false;
    } // end startScale

    function createScale(ele){
        var targetWidth = ele.offsetWidth + targetSpacing;
        var targetHeight = ele.offsetHeight + targetSpacing;
        try {
            if (!hasCreate) {
                var newScale = document.createElement('div');
                newScale.style.width = targetWidth + 'px';
                newScale.style.height = targetHeight + 'px';
                newScale.style.left = ele.offsetLeft - ((targetWidth - ele.offsetWidth) / 2) - 5 + 'px';
                newScale.style.top = ele.offsetTop - ((targetHeight - ele.offsetHeight) / 2) - 5 + 'px';
                newScale.style.zIndex = eleLayoutIndex - 1; // 低于元素层
                newScale.style.border = '5px dashed #34495E';
                newScale.setAttribute('id', 'scaleBox');
                showView.appendChild(newScale);
                hasCreate = true;
            }
            scaleBox = document.getElementById('scaleBox');
        }catch(e){
//            console.log(e);
            return false;
        }
        return true;
    }
    function deleteScale(){
        scaleOn = false;  // 关闭拖动
        if(hasCreate){
            showView.removeChild(scaleBox);
            hasCreate = false;
        }
    };
    function move(ele,attrObj){
        var x;
        var y;
        var referX;
        var referY;
        if(ele.id == "scaleBox"){
            x = attrObj.width;
            y = attrObj.height;
            referX = ele.offsetLeft;
            referY = ele.offsetTop;
        }else if(ele.id == ""){
            x = attrObj.left;
            y = attrObj.top;
            referX = ele.offsetWidth;
            referY = ele.offsetHeight;
        }
        if(x < targetSpacing){ //  边缘碰撞检测
            x = targetSpacing + 10;
        }else if(x > showView.offsetWidth - referX){
            x = showView.offsetWidth - referX - 10;
        };
        if(y < targetSpacing){
            y = targetSpacing + 10;
        }else if(y > showView.offsetHeight - referY){
            y = showView.offsetHeight - referY -10;
        };

        if(ele.id == "scaleBox"){  //  更新attr的信息
            setStyle(ele,{width:x,height:y});
        }else if(ele.id == ""){
            setStyle(ele,{left:x,top:y});
        }
    }; // end move

    function setStyle(element,css){
        for(var attr in css){
            element.style[attr] = css[attr] + 'px';
        }
    }; // end setStyle
    function isPc(){
        if('ontouchstart' in document){
            return false;
        }
        return true;
    }
    function getCoord(eleSize){
        var coordObj = {};
        var maxX = showView.offsetWidth - eleSize - (targetSpacing*2); // 最大值=显示总宽度 - 元素宽度 - 拖拽元素的间距
        var maxY = showView.offsetHeight - eleSize - (targetSpacing*2);
        coordObj.x = Math.floor(Math.random() * maxX + targetSpacing); // 最小值=从间距开始而不是0
        coordObj.y = Math.floor(Math.random() * maxY + targetSpacing);
        return coordObj;
    }

};  // end DragApp