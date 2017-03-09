(function() {
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    /**
     * @param imgList 要加载的图片地址列表，['aa/asd.png','aa/xxx.png']
     * @param callback 每成功加载一个图片之后的回调，并传入“已加载的图片总数/要加载的图片总数”表示进度
     * @param timeout 每个图片加载的超时时间，默认为5s
     */
    var loader = function(imgList, callback, timeout) {
        // 参数的初始化
        timeout = timeout || 5000;
        imgList = isArray(imgList) && imgList || [];
        callback = typeof(callback) === 'function' && callback;

        var total = imgList.length,
            loaded = 0,
            imgages = [],
            _on = function() {
                loaded < total && (++loaded, callback && callback(loaded / total));
            };

        // !total eg:!3 false    
        if (!total) {
            return callback && callback(1);
        }

        /**
         * 封装images对象
         * img.onload() 图片加载成功时执行，img.onerror() 图片加载失败时执行
         * Image对象实现图片预加载
         * src: 图片地址
         */
        for (var i = 0; i < total; i++) {
            imgages[i] = new Image();
            imgages[i].onload = imgages[i].onerror = _on;
            imgages[i].src = imgList[i];
        }

        /**
         * 如果timeout * total时间范围内，仍有图片未加载出来（判断条件是loaded < total），通知外部环境所有图片均已加载
         * 目的是避免用户等待时间过长
         */
        setTimeout(function() {
            loaded < total && (loaded = total, callback && callback(loaded / total));
        }, timeout * total);

    };
    /**
     * 在 CMD 规范中，一个模块就是一个文件
     * 可用来判定当前页面 有 Sea.js 等 CMD 模块加载器存在，例如：typeof define === "function" && define.cmd
     * define 是一个全局函数，用来定义模块
     * 所以imgLoader被loader赋值
     */
    "function" === typeof define && define.cmd ? define(function() {
            return loader
        }) :
        window.imgLoader = loader;
})();

/**
 * 图片加载的方法
 * @param imgList
 * @param callback
 */
imgLoader(['./images/bg1.jpg', './images/pagebg001.jpg', './images/pagebg002.jpg'], function(percentage) {
    setTimeout(function() {
        var percentT = percentage * 100;
        $('.precent').html(parseInt(percentT) + "%");
        console.log(parseInt(percentT) + "%");
        $('.progress').css("width", parseInt(percentT) + "%");
    }, 600);
});

//模拟加载慢的效果=》假效果，没有什么意义
// var callbacks = [];
// imgLoader(['./images/bg1.jpg', './images/pagebg001.jpg', './images/pagebg002.jpg'], function(percentage) {
//     var i = callbacks.length;
//     // _on方法第一次调用该回调方法的时候，callbacks数组的长度为0，那么callbackspush后，数组长度为1，
//     // 存储的方法callbacks[0]里面调用了callbacks[1],这样形成了循环调用
//     // 当callbacks[0]被触发后，后面的效果就很连续了
//     callbacks.push(function() {
//         setTimeout(function() {
//             var percentT = percentage * 100;
//             $('.precent').html(parseInt(percentT) + "%");
//             console.log(parseInt(percentT) + "%");
//             $('.progress').css("width", parseInt(percentT) + "%");

//             callbacks[i + 1] && callbacks[i + 1]();
//         }, 600);
//     });

//     if (percentage == 1) {
//         callbacks[0]();
//     }
// });