/**
 * 实现图片的预加载
 * 页面大的时候用，一般页面大小超过3M就该考虑使用；页面内包含数据量比较大的图片，在手机端测试能够明显看到加载缓慢的时候，可以考虑使用。
 * html里面的img标签和css中background-imag等都会触发浏览器去加载相关的图片
 * 通过javascript，创建Image对象，然后把这些对象的src属性设置成要加载的图片地址也能触发浏览器加载图片
 * 在页面里首先把那些用到了相关的图片的元素给藏掉，然后用js去加载图片，等到所有图片加载完毕再把藏掉的元素显示即可
 */
//loading效果
(function() {
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    var loader = function(imgList, callback, timeout) {
        // 检查参数的方法
        timeout = timeout || 5000;
        imgList = isArray(imgList) && imgList || [];
        callback = typeof(callback) === 'function' && callback;
        var total = imgList.length,
            loaded = 0,
            images = [],
            // 由于调用的是图片预加载里面的方法
            // 当loaded小于total的时候，loaded就会自加，然后调用图片预加载里面的方法，然后实现进度条
            _on = function() {
                loaded < total && (++loaded, callback && callback(loaded / total));
            };
        if (!total) {
            return callback && callback(1);
        }
        for (var i = 0; i < total; i++) {
            images[i] = new Image();
            images[i].onload = images[i].onerror = _on;
            images[i].src = imgList[i];
        }
        setTimeout(function() {
            loaded < total && (loaded = total, callback && callback(loaded / total));
        }, timeout * total);
    };
    // 三元>当.. imgLoader被loader赋值
    "function" === typeof define && define.cmd ? define(function() {
        return loader
    }) : window.imgLoader = loader;
})();

// 获取css样式里面背景图片的集合
function getallBgimages() {
    var url, B = [],
        A = document.getElementsByTagName('*');
    A = B.slice.call(A, 0, A.length);
    while (A.length) {
        url = document.deepCss(A.shift(), 'background-image');
        if (url) url = /url\(['"]?([^")]+)/.exec(url) || [];
        url = url[1];
        if (url && B.indexOf(url) == -1) B[B.length] = url;
    }
    return B;
}
document.deepCss = function(who, css) {
    if (!who || !who.style) return ''; // who和style都存在
    var sty = css.replace(/\-([a-z])/g, function(a, b) {
        return b.toUpperCase();
    });
    if (who.currentStyle) {
        return who.style[sty] || who.currentStyle[sty] || '';
    }
    var dv = document.defaultView || window;
    return who.style[sty] ||
        dv.getComputedStyle(who, "").getPropertyValue(css) || '';
}

Array.prototype.indexOf = Array.prototype.indexOf ||
    function(what, index) {
        index = index || 0;
        var L = this.length;
        while (index < L) {
            if (this[index] === what) return index;
            ++index;
        }
        return -1;
    }

// 创建一个数组，里面保存页面里面所有的图片url
// @return imageArr：保存图片地址的数组
function createImageArr() {
    var imageArr = [];
    // document.images返回当前HTML文档中图像的集合
    var imgs = document.images;
    // 获取css样式里面背景图片url的集合
    var cssImages = getallBgimages();
    for (var i = 0; i < imgs.length; i++) {
        imageArr.push(imgs[i].src);
    };
    for (var j = 0; j < cssImages.length; j++) {
        imageArr.push(cssImages[j]);
    };
    return imageArr;
}

// 图片预加载 
imgLoader(createImageArr(), function(percentage) {
    var percentT = percentage * 100;
    $(".running-load .precent").html(parseInt(percentT) + "%");
    $('.progress-bar .progress').css("width", parseInt(percentT) + "%");
    if (percentage == 1) {
        $(".loading").addClass("zoomOut").hide(500);
        $("#upload-btn").addClass("bounceInDown");
    };
});