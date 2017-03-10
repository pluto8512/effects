;
(function() {
    $upload = $('#upload'); // 图片上传按钮
    /**
     * 普通终端上传图片
     */
    $upload.on('change', function() {
        var file = $(this)[0].files[0];
        if (!file) { //undefined
            return;
        }
        var file = $(this)[0].files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file); // 将文件以Data URL形式进行读入页面
        reader.onload = function() {
            var base64 = this.result;
            //模拟form上传
            //form(base64);

            var img = new Image();
            img.onload = function() {
                var src = poster.filterImage(img, this.width, this.height); //将图片进行压缩，减少页面大小
                //var src = base64;
                $frameImg.data('width', this.width); //实际宽度
                $frameImg.data('height', this.height); //实际高度

                var realImg = new Image();
                realImg.onload = function() {
                    $frameImg.attr('src', realImg.src); //第三次载入Base64数据
                    next($first); //显示第二屏
                    endLoading();
                };
                realImg.src = src;
                rotates[0] = { src: src, width: this.width, height: this.height, image: realImg }; //用于旋转的缓存
            };
            img.src = base64;
        };

        //解决上传相同文件不触发onchange事件
        var clone = this.cloneNode(true);
        clone.onchange = arguments.callee; //克隆不会复制动态绑定事件
        clone.value = '';
        this.parentNode.replaceChild(clone, this);
    });

    /**
     * 将图片进行压缩，减少页面大小
     * 旋转操作也放在此处
     * @param image:img对象
     * @param width:img
     */
    function filterImage(image, width, height, deg) {
        var canvas = document.createElement('canvas');
        var pr = this.pixelRatio(canvas.getContext('2d'));

        //hidpi-canvas将canvas的width和height属性放大pr倍
        canvas.width = width / pr; //恢复为原先的大小
        canvas.height = height / pr;

        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFF'; //绘制背景色
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (deg) {
            ctx.rotate(deg * Math.PI / 180);
            ctx.drawImage(image, 0, -canvas.width);
        } else {
            ctx.drawImage(image, 0, 0, width, height);
        }

        return canvas.toDataURL('image/jpeg', 0.7);
    }
})();