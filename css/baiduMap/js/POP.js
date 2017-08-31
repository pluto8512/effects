/**
 * pop
 * @authors xiaodong (tumi330@163.com)
 * @date    2017-08-28
 * @version $0.1$
 */
var GAMECOMMON = {
    "pop":function(type) {
       switch (type) {
           case "pop_cry":
               var html = '\
                   <div class="pop_cry">\
                        <div class="wawa"></div>\
                        <div class="text">\
                            阿欧~没抓到</br>淘气的小龙溜走了\
                        </div>\
                        <div class="btn01"></div>\
                        <div class="text2">好东西就要跟朋友分享 --></div>\
                        <div class="close" id="pop_cry_close"></div>\
                    </div>\ ';
                    GAMECOMMON.popshow("fade",html,"pop_cry");
               break;
           case "pop_yun":
                var html = 
                    '<div class="pop_yun">'+ 
                        '<div class="wawa"></div>'+
                        '<div class="text">'+
                            '慢人一步</br>这个宝箱的奖品被洗劫一空！</br>爱笑的人运气不会差，</br>还有更多的奖励等你领取哦~'+
                        '</div>'+
                        '<div class="btn06"></div>'+
                        '<div class="text2">好东西就要跟朋友分享 --></div>'+
                        '<div class="close" id="pop_yun_close"></div>'+
                    '</div>';
                    GAMECOMMON.popshow("fade",html,"pop_yun");
               break;
            case "pop_happy":
                var html = 
                    '<div class="pop_happy">'+   
                        '<div class="wawa"></div>'+
                        '<div class="text">'+
                            '运气爆棚</br>获得有娱南山店派发的红包</br>还有更多更大的红包奖励哦~</br>赶紧去吧</br><span style="color:red;">￥2.89</span>'+
                        '</div>'+
                        '<div class="btn06"></div>'+
                        '<div class="text2">好东西就要跟朋友分享 --></div>'+
                        '<div class="close" id="pop_happy_close"></div>'+
                    '</div>';
                    GAMECOMMON.popshow("fade",html,"pop_happy");
               break;
           default:
               break;
       } 
    },
    "popshow":function(type,html,className) {
        switch (type) {
            case "fade":
               if($('.mask').find('className').length === 0){
                $('.mask').append(html);
               }
               $('.mask').show();
               $("."+className).animateCss('fadeInDown');
               $(document).on("click","#"+className+"_close",function(){
                $("."+className).animateCss('fadeOutUp',function(){
                    $('.mask').hide();
                });
                return false;
               });
               break;
        
            default:
                break;
        }
    }
};
$.fn.extend({
    animateCss: function (animationName,callback) {
        var callback = callback?callback:function(){};
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            callback();
        });
        return this;
    }
});
GAMECOMMON.pop("pop_happy");