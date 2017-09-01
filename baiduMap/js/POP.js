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
            case "pop_happy2":
               var html = 
                    '<div class="pop_happy2">'+   
                        '<div class="wawa"></div>'+
                        '<div class="text">'+
                            '恭喜你</br>获得有娱游戏代金券100元1张</br><span>(在有娱任意门店、满200即可使用)</span>'+
                        '</div>'+
                        '<div class="btn06"></div>'+
                        '<div class="text2">好东西就要跟朋友分享 --></div>'+
                        '<div class="close" id="pop_happy2_close"></div>'+
                    '</div>';
                   GAMECOMMON.popshow("fade",html,"pop_happy2");
              break;
            case "award":
               var html = 
                    '<div class="award">'+
                       '<div class="text1">夺宝秘籍</div>'+
                       '<div class="text2">越靠近<span style="color:#FFAE8C;">有娱商城</span>,红包金额越大,</br>奖品越多, 中奖概率也越高！</div>'+
                       '<div class="list">'+
                            '<div class="title">'+
                                '<div class="awardCenter"></div>'+
                                '<div class="myAward"></div>'+
                            '</div>'+
                            '<div class="content">'+
                                '<div class="awardCenterTab">'+
                                    '<div class="item">'+
                                        '<img src="./images/lotteryTicket.jpg" alt="奖券">'+
                                        '<div class="text">'+
                                            '<p>一等奖</p>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="myAwardTab"></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'
                  GAMECOMMON.popshow("fade",html,"award");
             break;
           default:
               var html = 
               '<div class="commonPop">'+
                    '<div class="title">提示</div>'+
                    '<div class="content">网络不给力哦~</div>'+
                    '<div class="footer" id="commonPop_close">'+
                        '确定'+
                    '</div>'+
                '</div>';
                GAMECOMMON.popshow("flipX",html,"commonPop");
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
               $(document).on("touchend","#"+className+"_close",function(){
                    $("."+className).animateCss('fadeOutUp',function(){
                            $('.mask').hide();
                    });
                    return false;
               });
               break;
            case "flipX": 
                if($('.mask').find('className').length === 0){
                    $('.mask').append(html);
                }
                $('.mask').show();
                $("."+className).animateCss('flipInX');
                $(document).on("touchend","#"+className+"_close",function(){
                        $("."+className).animateCss('flipOutX',function(){
                                $('.mask').hide();
                        });
                        return false;
                });
               break;
            default:
                break;
        }
    },
    "maopao":function (arra,params){
        
            var temp;
    
            for(var i=0;i<arra.length;i++){ //比较多少趟，从第一趟开始
    
                for(var j=0;j<arra.length-i-1;j++){ //每一趟比较多少次数
    
                    if(arra[j][params] > arra[j+1][params]){
                        temp=arra[j+1];
                        arra[j+1]=arra[j];
                        arra[j]=temp;
                    }
                }
            };
        return arra;
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
// GAMECOMMON.pop();
// $(".commonPop .content").text('请确保打开手机"定位服务",否则无法参与活动哦~');