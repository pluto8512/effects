(function (doc, win) {
	var docEl = doc.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
			recalc = function () {
		var clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		if(clientWidth > 800) clientWidth=800;
		docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
	};
	
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	recalc();
})(document, window);

$(function($) {
    
    //==========
    // Global Params Begine
    //==========
    var statu, // {全局状态}
        control_page; // {页面管理}

    //==========
    // Global Statu Begine
    //==========
    function main_perTest(sta) { // @param {状态值} sta 
        switch (sta) {
            case value:
                
                break;
        
            default:
                break;
        }
    }

    //==========
    // Control For Page Begine
    //==========
    page_control = {
        "show":function(page_name) {
            switch (page_name) {
                case "homePage":
                    page_control.clear();
                    $(".homePage").show();
                    break;
                case "quePage":
                    page_control.clear();
                    $(".quePage").show();
                    break;
                case "resultPage":
                    page_control.clear();
                    $(".resultPage").show();
                    break;
                default:
                    break;
            }
        },
        "hide":function() {

        },
        "clear":function() {
            $(".controlPage").each(function(index,dom){
                $(dom).hide();
            });
        }
    }

    //==========
    // Control For Btn Begine
    //==========
    btn_control = {
        "action":function(btn_name){
            switch (btn_name) {
                case "goToQuePage":
                    $(".goToQuePage").on("touchend",function(){
                        page_control.show("quePage");
                        return false;
                    });
                    break;
                case "submit":
                    $(".submit").on("touchend",function(){
                        // TODO
                        // 评分逻辑...getResult();
                        page_control.show("resultPage");
                        verticalAlign(".resultPage .item:nth-child(1)");
                        verticalAlign(".resultPage .item:nth-child(2)");
                        verticalAlign(".resultPage .item:nth-child(3)");
                        return false;
                    });
                    break;
                default:
                    break;
            }
        }
    }

    //==========
    // InitGame Begine
    //==========

    //==========
    // StartGame Begine
    //==========
    goToGamePage();

    //==========
    // Fn For Logic Begine
    //==========

    /**
     * 进入游戏页后的逻辑
     */
    function goToGamePage() {
        page_control.show("homePage");
        btn_control.action("goToQuePage");
        btn_control.action("submit");
    } 

    /**
     * 评分逻辑
     */
    function getResult() {

    }

    //==========
    // Fn For Tool Begine
    //==========

    /**
     * 游戏图片的预加载
     * @param {图片资源数组} imgArr 
     */
    function preloadImg(imgArr) {
        
    }

    /**
     * 判断字数
     */
    function textLength() {

    }

    /**
     * 表情和文字垂直居中
     * @param {选择器 string} selector 
     */
    function verticalAlign(selector) {
        var tplItem = $(selector);
        var tplIcon = tplItem.find(".icon");
        var tplContent = tplItem.find(".content");
        var h1 = tplItem.outerHeight();
        var h2 = tplIcon.outerHeight();
        var h3 = tplContent.outerHeight();
        var marginIcon = (h1-h2)/2;
        var marginContent = (h1-h3)/2;
        tplIcon.css({"marginTop":marginIcon+"px"});
        tplContent.css({"marginTop":marginContent+"px"});
    }

    //==========
    // Fn For Pop Begine
    //==========

});