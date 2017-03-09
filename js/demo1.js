/*
    **LOADING
     */

    (function () {
        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        // imgList：所有的图片
        // callback: 图片加载的方法
        // timeout： 延时 
        // total:图片的数量
        // loaded:已经加载好的图片
        var loader = function (imgList, callback, timeout) {
            timeout = timeout || 5000;
            imgList = isArray(imgList) && imgList || [];
            callback = typeof(callback) === 'function' && callback;
            var total = imgList.length,
                loaded = 0,
                images = [],
                _on = function () {
                    loaded < total && (++loaded, callback && callback(loaded / total));
                };
                // 没有图片时进入
            if (!total) {
                return callback && callback(1);
            }
            for (var i = 0; i < total; i++) {
                images[i] = new Image();
                images[i].onload = images[i].onerror = _on;
                images[i].src = imgList[i];
            }
            setTimeout(function () {
                loaded < total && (loaded = total, callback && callback(loaded / total));
            }, timeout * total);
        };
        "function" === typeof define && define.cmd ? define(function () {
            return loader
        }) : window.imgLoader = loader;
    })();

    function getallBgimages() {
        var url, B = [], A = document.getElementsByTagName('*');
        A = B.slice.call(A, 0, A.length);
        while (A.length) {
            url = document.deepCss(A.shift(), 'background-image');
            if (url) url = /url\(['"]?([^")]+)/.exec(url) || [];
            url = url[1];
            if (url && B.indexOf(url) == -1) B[B.length] = url;
        }
        return B;
    }
    document.deepCss = function (who, css) {
        if (!who || !who.style) return '';
        var sty = css.replace(/\-([a-z])/g, function (a, b) {
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
        function (what, index) {
            index = index || 0;
            var L = this.length;
            while (index < L) {
                if (this[index] === what) return index;
                ++index;
            }
            return -1;
        }

    function createImageArr() {
        var imageArr = [];
        var imgs = document.images;
        var cssImages = getallBgimages();
        for (var i = 0; i < imgs.length; i++) {
            imageArr.push(imgs[i].src);
        }
        for (var j = 0; j < cssImages.length; j++) {
            imageArr.push(cssImages[j]);
        }
        return imageArr;
    }

    

