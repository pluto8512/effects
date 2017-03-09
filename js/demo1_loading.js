
/*********************图片加载******************************/
FastClick.attach(document.body);
imgLoader(createImageArr(), function (percentage) {
    var percentT = percentage * 100;
    $('.loading p').html( (parseInt(percentT)) + '%');
    if (percentage == 1) {
       $("#loadeing").hide();
       $(".page01").addClass('pageAnim');
        $("audio")[2].play();
        document.addEventListener("WeixinJSBridgeReady", function () {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                $("audio")[2].play();
            });
        }, false);
       setTimeout(function(){
            $(".imgbig").addClass('page01Anim02');
            $(".imgbig").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
              $(".page01 .touT").css('opacity', '1');
            });
       }, 800)
    }
});


/**************************逻辑函数*************************/
MAINqt();
function MAINqt(){
    // STATUS:状态
    // blowing：吹呀吹的函数
   var STATUS = 0;
   var Dtime = "";
   var musicKey = true;
   blowing();

  $(".page01 .touT").click(function(event) {
      $(".page01").hide();
      $(".page02").addClass('pageAnim');
      setTimeout(function(){
        $(".cover02").addClass('coverAnim');
        $(".page02 .plot01 .enterr").addClass('typing');
        $(".page02 .plot01 .enterr").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          $(".page02 .plot02 .enterr").addClass('typing');
        });
        $(".page02 .plot02 .enterr").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(".page02 .btnLook").fadeIn(400);
        });
      }, 2500)
  });

  $(".page02 .btnLook").click(function(event) {
      clearInterval(pageTime);
     $("audio")[0].play();
     $(".page02").removeClass('pageAnim');
     $(".page03").addClass('pageAnim2');
     for(var i=0;i<6;i++){
        (function(i){
            var times = i*2000+1000;
            if(i==2) times = times+500;
            showDialogue(i,times);
        })(i)
     }
  });

  function showDialogue(j,times,callback){ //聊天对话框显示
    setTimeout(function(){
        $("audio")[0].play();
        $(".page03 ul li").eq(j).show();
        $('.page03 ul').animate({scrollTop:$('.page03 ul li').height()+'px'},500)
         if(j==5) entering();
         if(callback!=undefined) callback();
      }, times)
  }

  function showFriend(){ //朋友圈对话显示

    for(var i=4;i<9;i++){
        (function(i){
            var times = (i-4)*2000+1500;
            setTimeout(function(){
                $(".diaArea li").eq(i).show();
                $('.page04').animate({scrollTop:$('.insidePages').height()+'px'},500);
                if(i==8){
                  setTimeout(function(){
                      $(".page04").removeClass('pageAnim');
                      $(".page05").addClass('pageAnim');
                  }, 1000)
                }
            },times)
        })(i)
     }
  }

  function entering(types){ //聊天输入

    $(".entering").html("不行，我们要搬家！");
    $(".entering").addClass('typing');
    $(".page03 .touT").css('opacity', '1');
    $(".page03 .touT").click(function(event) {
        if($(".entering").attr("data-type")=="0"){

            $(".entering").attr("data-type","2");
            $(".entering").removeClass('typing').html("小伙伴们朋友圈走起！");
            showDialogue(6,100);
            showDialogue(7,1500,function(){
              $(".entering").addClass('typing');
              $(".entering").attr("data-type","1");
            });
        }
        if($(".entering").attr("data-type")=="1"){
            $(".entering").attr("data-type","2")
            $(".entering").removeClass('typing');
            showDialogue(8,100);
            setTimeout(function(){
                $(".page03").removeClass('pageAnim2');
                $(".page04").show();
                //showFriend();
             }, 2000)
        }
      
    });
  }
// 点击按钮吹风的按钮
// 触摸->风扇旋转（cs3）
// 风的图片显示
// 风的音乐播放
// 触摸开始启动定时器，触摸结束清除定时器
// 触摸结束移除相应的动态类
// showFruit：方法根据的递增的STATUS参数通过switch-case来触发不同的状态
  function blowing(){ //吹呀吹
      $(".blowTouch").on('touchstart',function(){
          musicKey = true;
          $(".rotary").addClass('rotaryAnim');
          $(".wind").addClass('windAnim');
          $("#fengAudio")[0].play();
          Dtime = setInterval(function(){
              STATUS ++;
              if(STATUS>1){
                $(".icebox").css('opacity', '0');
                $(".icebox2").css('opacity', '1');
              }
              showFruit(STATUS);
          }, 500)
      })
    //   通过取消右键点击弹出菜单的事件，可以自定义自己的菜单
      $('.blowTouch').bind('contextmenu', function(e) {
          e.preventDefault();
      })
      $(".blowTouch").on('touchend',function(){
          musicKey = false;
          clearInterval(Dtime);
          $(".rotary").removeClass('rotaryAnim');
          $(".wind").removeClass('windAnim');
      })
  }

  function showFruit(stas){  //水果展示
      switch(stas){
          case 4:
              $(".fly01").show();
              setTimeout(function(){
                $(".fruit01").css('opacity', '1');
              }, 1400)
              break;
          case 6:
              $(".fly02").show();
              setTimeout(function(){
                $(".fruit02").css('opacity', '1');
              }, 1400)
              break;
          case 9:
              $(".fly03").show();
              setTimeout(function(){
                $(".fruit03").css('opacity', '1');
              }, 1400)
              break;
          case 11:
              $(".fruit04").css('opacity', '0.8');
              setTimeout(function(){
                  $(".cover03").addClass('coverAnim');
                  $(".cover03 .plot01 .enterr").addClass('typing');
                  $(".cover03 .plot01 .enterr").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                      $(".cover03 .plot02 .enterr").addClass('typing');
                  });
                  $(".cover03 .plot02 .enterr").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                      $(".cover03 .plot03 .enterr").addClass('typing');
                  });
                  $(".cover03 .plot03 .enterr").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                      $(".btnLook").fadeIn(400);
                      $(".cover03 .btnLook").click(function(event){
                          $(".page05").removeClass('pageAnim');
                          $(".page06").show();
                          $(".page06 .touT").click(function(){
                              $(".page07").addClass('pageAnim');
                              $(".page06").hide();
                          });
                          //$('.fridImg').css("-webkit-transform","translate(0,-9rem)");
                          //setTimeout(function(){
                          //    $(".page07").addClass('pageAnim');
                          //    $(".page06").removeClass('pageAnim');
                          //},8000)
                      });
                  });
              },2000)
              break;
          default: break;
      }
  }

    $(".btnShow").on('touchstart',function(event) {
        $(".page07 .cover").addClass('coverAnim');
    });
    $(".page07 .cover").on('touchstart',function(event) {
        $(".page07 .cover").removeClass('coverAnim');
    });


    /********************音乐控制*********************/

    $("#fengAudio").on("ended",function(){
        if(musicKey) {
            $("#fengAudio")[0].play();
        }
    });
    $("#bgm").on("ended",function(){
        $("#bgm")[0].play();
    });

    $("#bgm").on("play",function(){
        $(".bgmPlay").show();
        $(".bgmPause").hide();
    });
    $("#bgm").on("pause",function(){
        $(".bgmPlay").hide();
        $(".bgmPause").show();
    });
    $(".musicBox").click(function(){
        if($("#bgm")[0].paused){
            $("#bgm")[0].play();
        }else{
            $("#bgm")[0].pause();
        }
    });
    $(".page04 .touT").click(function(){
        $(".page04").hide();
        $(".page05").addClass('pageAnim');
    });


    $(".btnUrl").click(function(){
        $(".attention").addClass("attentionAnim");
    });
    $(".bgCover").click(function(){
        $(".attention").removeClass("attentionAnim");
    });

    var pageTime = setInterval(function(){
        if($(".page02").hasClass("page02Bg")){
            $(".page02").removeClass("page02Bg");
        }else{
            $(".page02").addClass("page02Bg");
        }
    },500)


}