;(function(){
    // 获取按钮
    var btn = $('.blowTouch');
    var windy = $('.windy');
    var rota = $('.rotary');
    btn.on('touchstart',function(){
        windy.css("display","block");
        rota.css("display","block"); 
    });
})();