/*提示加载与音乐*/
var $loadingPage = $("#loading-page"); //loading页面
var $loadingInfo = $("#loading-info"); //loading信息
var $tips = $("#tips"); //提示框
var $audio = $("#audio"); //音乐
var $music = $("#music"); //音乐按钮

/*页面*/
var $guidePage = $("#guidePage"); //游戏引导页
var $indexPage = $("#indexPage"); //游戏首页
var $resultPage = $("#resultPage"); //生成页

/*弹窗*/
var $greetWordPop = $("#greetWordPop"); //祝福语弹窗
var $myGreet = $("#myGreet"); //我的祝福语弹窗
var $writePop = $("#writePop"); //手写弹窗
var notFirstGen = false;
var notFristUp = false;

/*上传图片*/
var $upload = $("#upload"); //上传按钮
var $frame = $("#frame"); //框
var $head = $("#head"); //头像
var isDoning = false; //防止二次提交
var Orientation; //拍摄方向角

/*生成图片*/
var $bg; //背景
var $wordFrame; //文字框
var $word; //生成的canvas文字
var $signature; //签名
var $compose = $("#compose"); //生成的canvas图片
var slideIndex = 0; //滑动起始值

var isUploadPic = false; //是否上传图片
var isUploadWord = false; //是否添加祝福语
var isSignature = false; //是否签名

/*手写面板*/
var drawCanvas; //手写canvas
var board; //手写面板
var img; //签名图片
var mousePress = false; //是否按下
var last = null; //手写签名最新的坐标点

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

/*
 *初始化模板
 * */
function initTemp() {
    $frame.find("li").attr("id", "");
    $frame.find("li").eq(slideIndex).attr("id", "activeTemp");

    $bg = $("#activeTemp .temp-bg");
    $wordFrame = $("#activeTemp .temp-frame");
    $word = $("#activeTemp .temp-word");
    $signature = $("#activeTemp .temp-signature");

    $(".temp-greeting").html(posterInfo.tempGreeting[slideIndex]);

    posterInfo.paintColor = posterInfo.tempWord[slideIndex].color;

}

/*
 * 重置模板
 * */
function resetTemp() {
    isUploadPic = false;
    slideIndex = 0;
    moveFrame();
    $(".temp-word").attr("src", initInfo.imagePath + "blank.gif");
    $(".temp-signature").attr("src", initInfo.imagePath + "blank.gif");
    $("#head").attr("src", initInfo.imagePath + "blank.gif");
    $(".temp-head-wrap").html('<i>上传图片</i><img src="' + initInfo.imagePath + 'blank.gif" alt="人物头像" id="head">');
    $head = $("#head");
}


/*
 * 海报生成canvas逻辑
 * */
var poster = {
    /**
     * devicePixelRatio设备像素比 webkitBackingStorePixelRatio Canvas缓冲区的像素比
     * 将canvas中的1像素等于屏幕中的1像素
     */
    pixelRatio: function(ctx) {
        var backingstore = ctx.webkitBackingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingstore;
    },
    /**
     * 将图片进行压缩，减少页面大小
     * 旋转操作也放在此处
     */
    filterImage: function(image, width, height, deg) {
        var canvas = document.createElement('canvas');
        var pr = this.pixelRatio(canvas.getContext('2d'));

        //hidpi-canvas将canvas的width和height属性放大pr倍
        canvas.width = width / pr; //恢复为原先的大小
        canvas.height = height / pr;

        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFF'; //绘制背景色
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //if(deg) {
        //        ctx.rotate(deg * Math.PI / 180);
        //        ctx.drawImage(image, 0, -canvas.width);
        //}else {
        //        ctx.drawImage(image, 0, 0, width, height);
        //}
        if (deg) {
            ctx.rotate(deg * Math.PI / 180);
            if (deg == -180) {
                ctx.drawImage(image, -canvas.width, -canvas.height);
            } else if (deg == 90) {
                ctx.drawImage(image, 0, -canvas.width);
            } else if (deg == -90) {
                ctx.drawImage(image, -canvas.height, 0);
            }
        } else {
            ctx.drawImage(image, 0, 0, width, height);
        }

        return canvas.toDataURL('image/jpeg', 0.7);
    },
    /**
     * 画图
     */
    drawImage: function(ctx, image, offset) {
        var pr = this.pixelRatio(ctx),
            key;
        ctx.save();
        for (key in offset.image) {
            offset.image[key] = Math.floor(offset.image[key]);
        }
        for (key in offset.frame) {
            offset.frame[key] = Math.floor(offset.frame[key]);
        }
        ctx.drawImage(image[0] || image,
            offset.image.x, offset.image.y, offset.image.w - 10, offset.image.h - 10,
            offset.frame.x * pr, offset.frame.y * pr, offset.frame.w * pr, offset.frame.h * pr);
        ctx.restore();
    },
    /**
     * 初始化拖拽,放缩事件
     * 开源库touch.js
     */
    initTouch: function(touchPad, img) {
        var offx = 0,
            offy = 0;
        var scale = 1;
        var currScale;

        function formatTransform(offx, offy, scale) {
            var translate = 'translate3d(' + (offx + 'px,') + (offy + 'px,') + '0)';
            scale = 'scale(' + scale + ')';
            //var rotate = 'rotate('+deg+'deg)';
            return translate + ' ' + scale;
        }

        touch.on(touchPad, 'touchstart', function(ev) {
            ev.preventDefault();
        });

        touch.on(touchPad, 'drag', function(ev) {
            var currOffx = offx + ev.x;
            var currOffy = offy + ev.y;
            img.style.webkitTransform = formatTransform(currOffx, currOffy, scale);
        });

        touch.on(touchPad, 'dragend', function(ev) {
            offx += ev.x;
            offy += ev.y;
        });

        touch.on(touchPad, 'pinch', function(ev) {
            if (typeof ev.scale != 'undefined') {
                currScale = ev.scale - 1 + scale;
                img.style.webkitTransform = formatTransform(offx, offy, currScale);
            }
        });

        touch.on(touchPad, 'pinchend', function() {
            scale = currScale;
        });
    },
    getOffset: function($dom) {
        var obj = $dom[0].getBoundingClientRect();
        var ret = {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
        };
        return ret;
    },
    /**
     * 计算出img在frame中的可见部分相对于img和frame的坐标及尺寸
     */
    intersect: function($frame, $img) {
        var imgX = 0,
            imgY = 0,
            imgW = 0,
            imgH = 0;
        var frmX = 0,
            frmY = 0;
        var imgOffset, frmOffset;
        var left, right, top, bottom;

        imgOffset = poster.getOffset($img); //图片的偏移对象
        frmOffset = poster.getOffset($frame); //画框的偏移对象

        left = imgOffset.left - frmOffset.left - 3; //图片到边框左边的距离 去除1px的边框
        right = left + imgOffset.width; //画框模型是border-box，所以图片宽度需要减去边框的宽度 就是574
        top = imgOffset.top - frmOffset.top - 3; //图片到边框上边的距离
        bottom = top + imgOffset.height;

        //图片在画框内
        if (!(right <= 0 || left >= frmOffset.width || bottom <= 0 || top >= frmOffset.height)) {
            if (left < 0) {
                imgX = -left;
                frmX = 0;
                imgW = (right < frmOffset.width) ? right : frmOffset.width;
            } else {
                imgX = 0;
                frmX = left;
                imgW = (right < frmOffset.width ? right : frmOffset.width) - left;
            }

            if (top < 0) {
                imgY = -top;
                frmY = 0;
                imgH = (bottom < frmOffset.height) ? bottom : frmOffset.height;
            } else {
                imgY = 0;
                frmY = top;
                imgH = ((bottom < frmOffset.height) ? bottom : frmOffset.height) - top;
            }
        }

        var ratio = $img.data('width') / $img.width(); //图片真实宽度 与 图片CSS宽度

        //图片的实际高度不能低于计算后的高度 否则iphone 5S中就不显示
        var imageHeight = imgH * ratio;
        if (+$img.data('height') < imageHeight) {
            imageHeight = $img.data('height');
        }

        return {
            frame: { x: frmX, y: frmY, w: (imgW + 6), h: (imgH + 6) }, //此处画框是574，而画布是580
            image: { x: imgX * ratio, y: imgY * ratio, w: imgW * ratio, h: imageHeight }
        };
    }
};

/*
 * 预加载图片
 * */
imgLoader(createImageArr(), function(percentage) {
    var percentT = percentage * 100;
    $loadingInfo.html('Loading ' + (parseInt(percentT)) + '%');
    if (percentage == 1) {
        $loadingPage.remove();
        audioControl();
        initTemp();
    };
});

/*
 * 事件开始
 */
function startLoading() {
    if (isDoning) {
        return false;
    }
    $tips.html("上传图片中...").show();
    isDoning = true;
    return true;
}

/*
 * 事件结束
 */
function endLoading() {
    $tips.hide();
    isDoning = false;
}

/*
 * 普通终端上传图片
 */
$upload.on('change', function() {
    if (!startLoading()) {
        return;
    }
    var file = $(this)[0].files[0];
    if (!file) { //undefined
        return;
    }
    if (!/image/ig.test(file.type)) {
        $.showTips("请上传图片文件");
        return false;
    }

    //引入EXIF插件检测照片方向
    EXIF.getData(file, function() {
        EXIF.getAllTags(this);
        Orientation = EXIF.getTag(this, "Orientation");
    });

    var reader = new FileReader();
    reader.readAsDataURL(file); // 将文件以Data URL形式进行读入页面
    reader.onload = function() {
        var base64 = this.result;
        //模拟form上传
        var img = new Image();
        img.onload = function() {
            if (navigator.userAgent.match(/iphone/i)) {
                // alert(Orientation);
                if (Orientation != "") {
                    switch (Orientation) {
                        //home键在右边
                        case 6: //需要顺时针90度旋转
                            //alert('需要顺时针（向左）90度旋转');
                            var src = poster.filterImage(img, this.height, this.width, 90);
                            $head.attr('data-width', this.height); //实际宽度
                            $head.attr('data-height', this.width); //实际高度
                            break;
                            //home键在上边
                        case 8: //需要逆时针90度旋转
                            //alert('需要顺时针（向右）90度旋转');
                            var src = poster.filterImage(img, this.height, this.width, -90);
                            $head.attr('data-width', this.height); //实际宽度
                            $head.attr('data-height', this.width); //实际高度
                            break;
                            //home键在左边
                        case 3: //需要-180度旋转
                            var src = poster.filterImage(img, this.width, this.height, -180);
                            $head.attr('data-width', this.width); //实际宽度
                            $head.attr('data-height', this.height); //实际高度
                            break;
                            //home键在右边 不做处理
                        case 1:
                            var src = poster.filterImage(img, this.width, this.height);
                            $head.attr('data-width', this.width); //实际宽度
                            $head.attr('data-height', this.height); //实际高度
                            break;
                        default:
                            var src = poster.filterImage(img, this.width, this.height);
                            $head.attr('data-width', this.width); //实际宽度
                            $head.attr('data-height', this.height); //实际高度
                            break;
                    }
                }
            } else {
                var src = poster.filterImage(img, this.width, this.height); //将图片进行压缩，减少页面大小
                $head.attr('data-width', this.width); //实际宽度
                $head.attr('data-height', this.height); //实际高度
            }

            var realImg = new Image();
            realImg.onload = function() {
                $head.prev().remove();
                $head.show().attr('src', realImg.src); //第三次载入Base64数据
                endLoading();
                isUploadPic = true;

                if (!notFristUp) {
                    $("#picChaTip").removeClass("hidden");
                }
                notFristUp = true;
                showGenPosterBtn();
                poster.initTouch($bg[0], $head[0]);
            };
            realImg.src = src;
        };
        img.src = base64;
    };

    //解决上传相同文件不触发onchange事件
    var clone = this.cloneNode(true);
    clone.onchange = arguments.callee; //克隆不会复制动态绑定事件
    clone.value = '';
    this.parentNode.replaceChild(clone, this);
});

/*
 *      生成文字逻辑
 *      以rem为单位
 *      str 生成文字
 *      width 图片宽
 *      height 图片高
 *      fontSize canvas文字大小
 *      breakNum 换行值
 *       x,y文字坐标
 * */
function greet(str, width, height, fontSize, color, x, y, breakNum, callback) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    var rem = parseFloat(parseFloat($(html).css("font-size")) / 100);
    var fSize = fontSize * rem;
    var linheight = fSize + 10;
    var x = x * rem;
    var y = y * rem;
    ctx.font = fSize + "px 微软雅黑";
    ctx.fillStyle = color;
    if (str.length > breakNum * 2) {
        var str_1 = str.substring(0, breakNum);
        var str_2 = str.substring(breakNum, breakNum * 2);
        var str_3 = str.substring(breakNum * 2, str.length);
        ctx.fillText(str_1, x, y);
        ctx.fillText(str_2, x, y + linheight);
        ctx.fillText(str_3, x, y + linheight * 2);
    } else if (str.length > breakNum) {
        var str_1 = str.substring(0, breakNum);
        var str_2 = str.substring(breakNum, str.length);
        ctx.fillText(str_1, x, y);
        ctx.fillText(str_2, x, y + linheight);
    } else {
        ctx.fillText(str, x, y);
    }
    ctx.stroke();
    ctx.save();
    var image = new Image();
    //ctx.drawImage(image,0,0,width,height);
    image.src = canvas.toDataURL("image/png");
    image.onload = function() {
        $word.attr("src", image.src).attr("data-width", image.width).attr("data-height", image.height);
        isUploadWord = true;

        if (!/data/ig.test($signature.attr("src"))) {
            $indexPage.find("span.temp-input").show();
        }
        $("#temp-tips").removeClass().hide();
        showGenPosterBtn();
        callback && callback();
    };
}

function generateWord() {
    var width = parseInt($word.width());
    var height = parseInt($word.height());
    var str = posterInfo.greetWord;

    var x = posterInfo.tempWord[slideIndex].x;
    var y = posterInfo.tempWord[slideIndex].y;
    var fontSize = posterInfo.tempWord[slideIndex].fontSize;
    var color = posterInfo.tempWord[slideIndex].color;
    var breakNum = posterInfo.tempWord[slideIndex].breakNum;

    greet(str, width, height, fontSize, color, x, y, breakNum);
}

/*
 * 显示生成海报按钮
 */
function showGenPosterBtn() {
    var word = /data/ig.test($word.attr("src"));
    var sign = /data/ig.test($signature.attr("src"));
    var btn = $indexPage.find(".index-btn2");

    if (slideIndex == 2) {
        if (word && sign && isUploadPic) {
            btn.removeClass("hidden");
        }
    } else {
        if (word && sign) {
            btn.removeClass("hidden");
        }
    }
}

/**
 * 生成海报
 */
function generatePoster(callback) {
    var canvas = document.createElement('canvas');
    canvas.width = $frame[0].offsetWidth;
    canvas.height = $frame[0].offsetHeight + 6;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#E83436"; //绘制背景色
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    var bg = new Image();
    bg.src = imgBase64["temp" + slideIndex][0];
    bg.onload = function() {
        if (slideIndex == 2) {
            poster.drawImage(ctx, $head, poster.intersect($frame, $head));
        }
        poster.drawImage(ctx, bg, poster.intersect($frame, $bg));
        var wordFrame = new Image();
        wordFrame.src = imgBase64["temp" + slideIndex][1];
        wordFrame.onload = function() {
            poster.drawImage(ctx, wordFrame, poster.intersect($frame, $wordFrame));
            poster.drawImage(ctx, $word, poster.intersect($frame, $word));
            poster.drawImage(ctx, $signature, poster.intersect($frame, $signature));
            var base64 = canvas.toDataURL('image/jpeg', 0.7);
            $compose[0].onload = function() {
                callback && callback();
            };
            $compose[0].src = base64;
        };
    };
}

/*
 * 移动模板框
 * $input:输入框
 * slideIndex:轮播图的序号 
 * */
function moveFrame() {
    var $ul = $indexPage.find("ul");
    var width = $ul.find("li").width();
    var $input = $("#tempInput");
    $input.hide();

    if (slideIndex < 0) {
        slideIndex = 3;
    }
    if (slideIndex > 3) {
        slideIndex = 0;
    }

    $indexPage.find(".index-btn2").addClass("hidden");
    $("#temp-tips").removeClass().addClass("temp-tips-" + (slideIndex + 1)).hide();

    // js动态改变输入框的位置
    switch (slideIndex) {
        case 0:
            $("#upload").css("left", "-300px");
            $input.css({
                "left": "3.10rem",
                "top": "7.04rem"
            });
            break;
        case 1:
            $("#upload").css("left", "-300px");
            $input.css({
                "left": "2.80rem",
                "top": "5.60rem"
            });
            break;
        case 2:
            $("#upload").css("left", "1.70rem");
            $input.css({
                "left": "2.60rem",
                "top": "6.70rem"
            });
            break;
        case 3:
            $("#upload").css("left", "-300px");
            $input.css({
                "left": "3.50rem",
                "top": "7.54rem"
            });
            break;
    }
    $indexPage.find(".frame-paging span").removeClass("active");
    $indexPage.find(".frame-paging span").eq(slideIndex).addClass("active");

    initTemp();

    $ul.animate({
        "transform": "translateX(-" + width * slideIndex + "px)"
    }, 300, function() {
        if (!/data/ig.test($word.attr("src"))) {
            $("#temp-tips").show(1500);
        } else {
            $("#temp-tips").hide();
        }
        showGenPosterBtn();
    });
}

/*
 * 手写面板
 * */
function initDraw() {
    drawCanvas = document.getElementById("drawCanvas");
    img = document.getElementById('img');
    drawCanvas.width = $(".canvas-wrap").width();
    drawCanvas.height = $(".canvas-wrap").height();
    board = drawCanvas.getContext('2d');
    board.lineWidth = 4;
    board.lineCap = "square";
    board.strokeStyle = posterInfo.paintColor;

    drawCanvas.onmousedown = beginDraw;
    drawCanvas.onmousemove = drawing;
    drawCanvas.onmouseup = endDraw;
    drawCanvas.addEventListener('touchstart', beginDraw, false);
    drawCanvas.addEventListener('touchmove', drawing, false);
    drawCanvas.addEventListener('touchend', endDraw, false);
}

function beginDraw() {
    // $writePop.find(".write-tips").hide();
    mousePress = true;
}

function drawing(event) {
    event.preventDefault();
    if (!mousePress) return;
    var xy = pos(event);
    if (last != null) {
        board.beginPath();
        board.moveTo(last.x, last.y);
        board.lineTo(xy.x, xy.y);
        board.stroke();
    }
    last = xy;
}

function endDraw(event) {
    mousePress = false;
    event.preventDefault();
    last = null;
}

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

function isTouch(event) {
    var type = event.type;
    if (type.indexOf('touch') >= 0) {
        return true;
    } else {
        return false;
    }
}

function save() {
    var dataUrl = drawCanvas.toDataURL();

    $(".temp-input").hide();
    $signature.attr({
        "src": dataUrl,
        "data-width": drawCanvas.width,
        "data-height": drawCanvas.height
    }).show();
    clean();
    showGenPosterBtn();
}

function clean() {
    board.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
}

/*滑动引导页*/
$guidePage.find(".guide-btn").on("click", function() {
    $("#slideTip").removeClass("hidden");
    $indexPage.removeClass("hidden");
    $guidePage.hide(30);
});
/*首页*/
$("#slideTip").on("click", function() {
    $("#slideTip").addClass("hidden");
});
$("#picChaTip").on("click", function() {
    $("#picChaTip").addClass("hidden");
});
$("#genTip").on("click", function() {
    $("#genTip").addClass("hidden");
});


/*首页*/
$indexPage.find(".temp-word").on("click", function() {
    $greetWordPop.fadeIn(30);
});
$("#temp-tips").on("click", function() {
    $greetWordPop.fadeIn(30);
});

$indexPage.find(".index-btn2").on("click", function() {
    if (!isUploadPic && slideIndex == 2) {
        $.showTips("请上传您的美照");
        return;
    }

    if (!/data/ig.test($word.attr("src"))) {
        $.showTips("请添加您的祝福语");
        return;
    }
    if (!/data/ig.test($signature.attr("src"))) {
        $.showTips("请添加您的签名");
        return;
    }
    generatePoster(function() {
        if (!notFirstGen) {
            $("#genTip").removeClass("hidden");
            notFirstGen = true;
        }
        //$resultPage.show(30);
        //$indexPage.hide(30);
        $resultPage.removeClass("hidden");
        $indexPage.addClass("hidden");
    });

});
$indexPage.find(".frame-prev").on("click", function() {
    slideIndex--;
    moveFrame();
});
$indexPage.find(".frame-next").on("click", function() {
    slideIndex++;
    moveFrame();
});
$indexPage.find("span.temp-input").on("click", function() {
    $writePop.fadeIn(30, function() {
        initDraw();
    });
});
$indexPage.find("img.temp-signature").on("click", function() {
    $writePop.fadeIn(30, function() {
        initDraw();
    });
});

/*结果页*/
$resultPage.find(".result-btn1").on("click", function() {
    resetTemp();
    $resultPage.addClass("hidden");
    $indexPage.removeClass("hidden");
});

/*祝福语弹窗*/
$greetWordPop.find(".greeting-touch-pad").on("click", function() {
    $greetWordPop.fadeOut(10);
}).end().find("li").on("click", function() {
    posterInfo.greetWord = $(this).html();
    generateWord();
    $.hover($(this), 300, function() {
        $greetWordPop.fadeOut(30);
    });
}).end().find(".greeting-btn").on("click", function() {
    $myGreet.fadeIn(10);
});

/*我的祝福语*/
$myGreet.find(".my-word-btn-1").on("click", function() {
    $myGreet.find("textarea").val("");
    $myGreet.fadeOut(10);
}).end().find(".my-word-btn-2").on("click", function() {
    var val = $.trim($myGreet.find("textarea").val());
    if (val == "") {
        $.showTips("请输入您的祝福语");
        return;
    };
    posterInfo.greetWord = val;
    generateWord();
    $myGreet.fadeOut(10);
    $greetWordPop.fadeOut(10);
});

/*手写面板*/
$writePop.find(".write-btn-1").on("click", function() {
    clean();
});
$writePop.find(".write-btn-2").on("click", function() {
    save();
    $writePop.fadeOut(30);
    isSignature = true;
});
$writePop.find(".write-tips").on("touchstart", function() {
    $(this).css({
        "display": "none"
    });
});