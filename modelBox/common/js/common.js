/**
 * 精灵涂
 * 2017/7/24
 * tumi330@163.com
 */
var commonMethods = {
    addMask:function(type){
        switch (type) {
            case 1:
                var html = 
                '<div class="modalBox_mask"></div>'
                $("body").append(html);
                break;
            case 2:
                var html =
                '<div class="modalBox_mask">\
                    <span class="head">\
                        <p class="p_center p_title">能量不足</p>\
                    </span>\
                </div>';
                $("body").append(html);
                break;
            default:
                break;
        }
    },
    addPop:function(type,able){
        switch (type) {
            case "SMB_001":
                commonMethods.addMask(1);
                var html =
                '<div class="SMB" id="SMB_001">\
                    <div class="SMB_content1">\
                        <div class="box_text">\
                            <p class="p_center">阿欧~金币不足</p>\
                            <p class="p_center">转动转盘可获得大量金币</p>\
                            <p class="p_center">是时候去赚点钱啦!</p>\
                        </div>\
                    </div>\
                    <div class="SMB_btn SMB_btn1"></div>\
                </div>';
                $(".modalBox_mask").append(html);  
                break;
            case "SMB_002":
                commonMethods.addMask(1);
                var html = 
                '<div class="SMB" id="SMB_002">\
		            <div class="SMB_title SMB_title1 "></div>\
		            <div class="SMB_content2"></div>\
		            <div class="SMB_btn SMB_btn2"></div>\
                </div>';
                $(".modalBox_mask").append(html);      
                break;
            case "SMB_003":
                commonMethods.addMask(1);
                var html =
                '<div class="SMB" id="SMB_003">\
                    <div class="SMB_title SMB_title2 "></div>\
                    <div class="SMB_content3">\
                        <div class="redBag"></div>\
                        <div class="box_text">\
                            <p class="p_center">红包已经发放成功,记得查看微信哦</p>\
                        </div>\
                    </div>\
                    <div class="SMB_btn SMB_btn3"></div>\
                </div>';
                $(".modalBox_mask").append(html);
                break;
            
            case "BMB_001":
                commonMethods.addMask(1);
                var html = 
                '<div class="BMB" id="BMB_001">\
                    <span class="BMB_icon BMB_icon1"></span>\
                    <span class="BMB_title BMB_title1"></span>\
                    <span class="close"></span>\
                    <span class="BMB_content1"></span>\
                    <div class="box_text">\
                        <p class="p_center">欢迎回家，主人又是元气满满的一天哦~</p>\
                        <p class="p_center">为了早日建完岛屿，领取大奖</p>\
                        <p class="p_center">特地为你准备了<span class="mark">30点能量</span></p>\
                    </div>\
                    <span class="BMB_subhead BMB_subhead1"></span>\
                    <div class="BMB_btn BMB_btn1"></div>\
                </div>';
                $(".modalBox_mask").append(html);   
                break;
            case "BMB_002":
                if(able){
                    var btnType = "BMB_btn2";
                    commonMethods.addMask(2);
                }else {
                    var btnType = "BMB_btn2_disable";
                    commonMethods.addMask(1);
                }
                var html = 
                '<div class="BMB" id="BMB_002">\
                    <span class="BMB_icon BMB_icon2"></span>\
                    <span class="BMB_title BMB_title3"></span>\
                    <span class="close"></span>\
                    <div class="BMB_content2_1">\
                        <ul>\
                            <li class="li_text">早上08:00-10:00&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="icon"></span><i>X3</i><span class="btn fr"></span></li>\
                            <li class="li_text">中午12:00-14:00&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="icon"></span><i>X3</i><span class="btn fr"></span></li>\
                            <li class="li_text">晚上17:00-19:00&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="icon"></span><i>X3</i><span class="btn fr"></span></li>\
                        </ul>\
                    </div>\
                    <div class="wrap_gameRule">\
                        <p class="small_text">【游戏规则】每人可领取3次免费能量，错过领取时间能量作废。</p>\
                    </div>\
                    <span class="BMB_subhead BMB_subhead2" style="top:2.76rem"></span>\
                    <div class="BMB_btn '+btnType+'">\
                        <span class="BMB_content2_5"></span>\
                    </div>\
                    <div class="wrap_shareRule">\
                        <p class="small_text">【分享规则】分享成功即刻领取能量每人限领取一次。</p>\
                    </div>\
                </div>';
                $(".modalBox_mask").append(html);
                break;
            case "BMB_0030":
                commonMethods.addMask(1);
                var html =
                '<div class="BMB" id="BMB_0030">\
                    <span class="BMB_icon BMB_icon1"></span>\
                    <span class="BMB_title BMB_title3"></span>\
                    <span class="close"></span>\
                    <div class="BMB_subhead BMB_subhead4"></div>\
                    <div class="BMB_content3_1">\
                        <div class="box_text">\
                            <p class="p_center">【领奖规则】<span class="mark">在2017年7月1日~9月1日</span></p>\
                            <p class="p_center">完成岛屿建设即可领奖，数量有限，先到先得</p>\
                        </div>\
                    </div>\
                    <div class="BMB_content3_2">\
                        <span class="img"></span>\
                        <div class="wrap_text fr">\
                            <p class="p_center">现金红包￥100元</p>\
                            <p class="p_center">奖品剩余: <span class="mark">68份</span></p>\
                            <p class="p_center">已有2718人领取</p>\
                        </div>\
                    </div>\
                    <div class="BMB_content3_3">\
                        <div class="progress"></div>\
                        <p class="p_center">建岛进度:4/25</p>\
                    </div>\
                    <div class="BMB_btn BMB_btn3"></div>\
                </div>';
                $(".modalBox_mask").append(html);
                break;
            case "BMB_0031":
                commonMethods.addMask(1);
                var html =
                '<div class="BMB " id="BMB_0031">\
                    <span class="BMB_icon BMB_icon1"></span>\
                    <span class="BMB_title BMB_title3"></span>\
                    <span class="close"></span>\
                    <div class="BMB_subhead BMB_subhead3"></div>\
                    <div class="BMB_content3_2">\
                        <span class="img"></span>\
                        <div class="wrap_text fr">\
                            <p class="p_center">现金红包￥100元</p>\
                            <p class="p_center">奖品剩余: <span class="mark">68份</span></p>\
                            <p class="p_center">已有2718人领取</p>\
                        </div>\
                    </div>\
                    <div class="BMB_content3_3">\
                        <div class="progress"></div>\
                        <p class="p_center">建岛进度:4/25</p>\
                    </div>\
                    <div class="BMB_btn BMB_btn1"></div>\
                </div>';
                $(".modalBox_mask").append(html);
                break;
            case "BMB_004":
                commonMethods.addMask(1);
                var html = 
                '<div class="BMB" id="BMB_004">\
                    <span class="BMB_icon BMB_icon3"></span>\
                    <span class="BMB_title BMB_title2"></span>\
                    <span class="close"></span>\
                    <div class="wrap_text">\
                        <p class="p_center align_l">【游戏玩法】</p>\
                        <p class="p_center align_l">转动转盘获得金币，金币购买建岛建筑<br>升级岛屿。岛屿建设完后可获得奖励。</p>\
                    </div>\
                    <div class="wrap_text2">\
                        <p class="p_center align_l">【领奖规则】</p>\
                        <p class="p_center align_l">转动转盘获得金币，金币购买建岛建筑<br>升级岛屿。岛屿建设完后可获得奖励。</p>\
                    </div>\
                </div>';
                $(".modalBox_mask").append(html);
                break;
            case "BMB_005":
                commonMethods.addMask(1);
                var html =
                '<div class="BMB" id="BMB_005">\
                    <span class="BMB_icon BMB_icon1"></span>\
                    <span class="BMB_title BMB_title3"></span>\
                    <span class="close"></span>\
                    <div class="BMB_subhead BMB_subhead5"></div>\
                    <div class="BMB_content3_2">\
                        <span class="img"></span>\
                        <div class="wrap_text fr">\
                            <p class="p_center">现金红包￥100元</p>\
                            <p class="p_center">【奖品详情】</span></p>\
                            <p class="p_center">建设完岛屿即可领取100元,<br>奖品已经放在你的微信钱包<br>中。</p>\
                        </div>\
                    </div>\
                    <div class="BMB_content3_3">\
                        <div class="progress"></div>\
                        <p class="p_center">建岛进度:25/25</p>\
                    </div>\
                    <div class="BMB_btn BMB_btn4"></div>\
                </div>';
                $(".modalBox_mask").append(html);
                break;
            case "BMB_006":
                commonMethods.addMask(1);
                var html = 
                '<div class="BMB" id="BMB_006">\
                    <span class="BMB_icon BMB_icon1"></span>\
                    <span class="BMB_title BMB_title3"></span>\
                    <span class="close"></span>\
                    <div class="wrap_text2 fr">\
                        <p class="p_center">双子岛奖品已领完，每建完一座岛</p>\
                        <p class="p_center">即可前往下一座岛，同时领取相应的奖励</p>\
                        <p class="p_center mark">白羊岛即将开放,敬请期待</p>\
                    </div>\
                    <div class="BMB_content3_2">\
                        <span class="img"></span>\
                        <div class="wrap_text fr">\
                            <p class="p_center">现金红包￥100元</p>\
                            <p class="p_center">奖品剩余: <span class="mark">68份</span></p>\
                            <p class="p_center">已有2718人领取</p>\
                        </div>\
                    </div>\
                    <div class="BMB_content3_3">\
                        <div class="progress"></div>\
                        <p class="p_center">建岛进度:4/25</p>\
                    </div>\
                    <div class="BMB_btn BMB_btn4"></div>\
                </div>';
                $(".modalBox_mask").append(html);
                break;
            case "BMB_007":
                commonMethods.addMask(1);
                var html =
                '<div class="BMB" id="BMB_007">\
                    <span class="BMB_icon BMB_icon1"></span>\
                    <span class="BMB_title BMB_title3"></span>\
                    <span class="close"></span>\
                    <div class="wrap_text2 fr">\
                        <p class="p_center">【领奖规则】</p>\
                        <p class="p_center">2017年7月1日~2017年9月1日</p>\
                        <p class="p_center mark">完成岛屿建设即可领奖</p>\
                    </div>\
                    <div class="BMB_content3_2">\
                        <span class="img"></span>\
                        <div class="wrap_text fr">\
                            <p class="p_center textLeft">现金红包￥100元</p>\
                            <p class="p_center textLeft">奖品已经被领完</p>\
                            <p class="p_center textLeft">下一座岛奖励即将开放,赶<br>紧建完本岛前往下一座岛吧</p>\
                        </div>\
                    </div>\
                    <div class="BMB_content3_3">\
                        <div class="progress"></div>\
                        <p class="p_center">建岛进度:25/25</p>\
                    </div>\
                    <div class="BMB_btn BMB_btn4"></div>\
                </div>';
                $(".modalBox_mask").append(html);
                break;
            case "rtShare":
                var html =
                '<div class="rtShare" id="rtShare">\
                    <div class="img">\
                        <div class="box_text">\
                            <p class="p_center">点这,</p>\
                            <p class="p_center">将<span class="mark">6点能量</span>收入囊中</p>\
                        </div>\
                    </div>\
                </div>';
                $("body").append(html);
                break;
            default:
                break;
        }
    },
    closeEvent:function(){
        $(document).on("touchend",".modalBox_mask .close",function(){
            $(".modalBox_mask").remove();
        });
    },
    toShare:function(){
        commonMethods.addMask(1);
        var html = 
        '<div class="toShare"></div>';
        $(".modalBox_mask").append(html);
    }
}

var type = "rtShare";
commonMethods.addPop(type);  
// commonMethods.closeEvent();
