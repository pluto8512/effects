/**
 * 手写面板
 */
;
(function() {
    // 原始数据
    var posterInfo = {
        headImg: "",
        greetWord: "",
        paintColor: "",
        tempWord: [{
                x: 71,
                y: 68,
                color: "#eb3738",
                fontSize: 24,
                breakNum: 13
            },
            {
                x: 26,
                y: 50,
                color: "#ffe499",
                fontSize: 24,
                breakNum: 13
            },
            {
                x: 78,
                y: 52,
                color: "#eb3738",
                fontSize: 22,
                breakNum: 12
            },
            {
                x: 40,
                y: 55,
                color: "#ffb180",
                fontSize: 24,
                breakNum: 17
            }
        ],
        tempGreeting: [
            "辞旧岁欢欣鼓舞庆胜利，迎新春豪情满怀谱新篇！",
            "花开富贵迎祥瑞，喜气洋洋过大年！鸡年大吉！",
            "鸡年好，福气绕，财神捧着元宝到！",
            "瑞雪飞舞华灯上，红红火火过大年！鸡年大吉！"
        ]
    };

    // 初始化参数
    var mousePress = false; //是否按下
    var last = null; //手写签名最新的坐标点
    var board; //手写面板(画笔)
    var $signature = $('.signature');
    var $biuld_btn = $('.biuld_btn');
    var drawCanvas = $('#drawCanvas');
    // 初始化面板
    initDraw();
    // 绑定完成事件
    $biuld_btn.on('click', save);

    /**
     * 初始化面板
     * drawCanvas:获取canvas画板
     * img:null
     */
    function initDraw() {
        drawCanvas = document.getElementById("drawCanvas");
        img = document.getElementById('img');
        // canvas以父盒子的宽高为自己的宽高的好处
        drawCanvas.width = $(".canvas-wrap").width();
        drawCanvas.height = $(".canvas-wrap").height();
        // 拿画笔
        board = drawCanvas.getContext('2d');
        // 初始化画笔
        board.lineWidth = 4;
        // 线头样式
        board.lineCap = "square";
        //  初始化填充颜色
        posterInfo.paintColor = "red";
        // 填充颜色
        board.strokeStyle = posterInfo.paintColor;
        // 绑定事件
        drawCanvas.onmousedown = beginDraw;
        drawCanvas.onmousemove = drawing;
        drawCanvas.onmouseup = endDraw;
        drawCanvas.addEventListener('touchstart', beginDraw, false);
        drawCanvas.addEventListener('touchmove', drawing, false);
        drawCanvas.addEventListener('touchend', endDraw, false);
    }
    /**
     * 开始画
     */
    function beginDraw() {
        // // 提示文字隐藏
        // $writePop.find(".write-tips").hide();
        // 触摸的标识符
        mousePress = true;
        console.log(12343);
    }
    /**
     * 画的过程
     * @param {*} event 
     */
    function drawing(event) {
        event.preventDefault();
        if (!mousePress) return;
        // pos获取触点相对画布的位置
        var xy = pos(event);
        // 当last不为null时通过拿到的起点和新触电的坐标制图
        if (last != null) {
            board.beginPath();
            board.moveTo(last.x, last.y);
            board.lineTo(xy.x, xy.y);
            board.stroke();
        }
        // 当last为null时，拿到位置
        last = xy;
    }
    /**
     * 结束绘画
     * @param {*} event 
     */
    function endDraw(event) {
        mousePress = false;
        event.preventDefault();
        last = null;
    }
    // 获取点击相对于面版的位置
    function pos(event) {
        var x, y;
        if (isTouch(event)) {
            var offset = $(drawCanvas).offset();
            x = event.touches[0].clientX - offset.left;
            y = event.touches[0].clientY - offset.top;
        } else {
            x = event.offsetX + event.target.offsetLeft;
            y = event.offsetY + event.target.offsetTop;
        }
        return { x: x, y: y };
    }

    // 判断是否touch事件
    function isTouch(event) {
        var type = event.type;
        if (type.indexOf('touch') >= 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * canvas生成图片
     * 调用toDataURL以后直接生成图片，返回图片地址
     * 可以通过img标签显示出来
     */
    function save() {
        console.log('打印');
        var dataUrl = drawCanvas.toDataURL();

        $signature.attr({
            "src": dataUrl,
            "data-width": drawCanvas.width,
            "data-height": drawCanvas.height
        });
        clean();
        // showGenPosterBtn();
    }

    // 清空面板
    function clean() {
        board.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    }
})();