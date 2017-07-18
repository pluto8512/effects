/**
 * qianxi
 * XD
 * 2017/6/29
 */
;(function(){
    // 校验手机号码
    var regMobile = /^(13[0-9]|14[57]|15[0-9]|18[0-9])\d{8}$/;
    // 校验密码
    var regPassword = /^(\w){6,20}$/;
    // 全局配置
    var G = {
        // 锁-不能重复点击按钮(false 为锁住)
        'lock_disable':true,
        // 锁-不重复创建注册界面
        'lock_creatRegister':true
    };
    var initpage = (function(){
        var tpl = document.getElementById("login_tpl").text;
        var	html = $.template(tpl).render();
        $("#myApp").html(html);
    })();
    /**
     * 校验登录界面输入信息
     * @param {输入值1} inp1 
     * @param {输入值2} inp2 
     * @param {正则1} regEx1 
     * @param {正则2} regEx2 
     * @param {提示1} tips1 
     * @param {提示2} tips2 
     */
    var check = function(inp1, inp2, regEx1, regEx2, tips1, tips2) {
        if (regEx1.test(inp1.eq(0).val()) && regEx2.test(inp2.eq(0).val())) {
            return true;
        } else if(!regEx1.test(inp1.eq(0).val())){
            // 提示页面
            var tipHtml = 
            '<div class="tips">\
                    <p class="text">'+tips1+'</p>\
                    <div class="okBtn" id="okBtn">知道了</div>\
                </div>';
            $("#tipMask").html(tipHtml);
            $("#tipMask").show();
        } else if(regEx1.test(inp1.eq(0).val()) && !regEx2.test(inp2.eq(0).val())){
            // 提示页面
            var tipHtml = 
            '<div class="tips">\
                    <p class="text">'+tips2+'</p>\
                    <div class="okBtn" id="okBtn">知道了</div>\
                </div>';
            $("#tipMask").html(tipHtml);
            $("#tipMask").show();
        }
    }
    /**
     * 校验注册界面第一步输入信息
     * @param {输入值1} inp1 
     * @param {输入值2} inp2 
     * @param {正则1} regEx 
     * @param {提示1} tips1 
     * @param {提示2} tips2 
     */
    var checkregister = function(inp1,inp2,regEx,tips1,tips2) {
        if(!regEx.test(inp1.eq(0).val())){
            var tipHtml = 
            '<div class="tips">\
                    <p class="text">'+tips1+'</p>\
                    <div class="okBtn" id="okBtn">知道了</div>\
                </div>';
            $("#tipMask").html(tipHtml);
            $("#tipMask").show();
        }else if (""){
            // TODO 校验验证码
            var tipHtml = 
            '<div class="tips">\
                    <p class="text">'+tips2+'</p>\
                    <div class="okBtn" id="okBtn">知道了</div>\
                </div>';
            $("#tipMask").html(tipHtml);
            $("#tipMask").show();
        }else {
            // 跳到注册的第二个页面
            todoStepTwo();
        }
    }  
    /**
     * 校验完成界面s输入信息
     * @param {输入值1} inp1 
     * @param {输入值2} inp2 
     * @param {正则1} regEx 
     * @param {提示1} tips1 
     * @param {提示2} tips2 
     */
    var checkfinish = function(inp1,inp2,regEx,tips1,tips2,){
        if (regEx.test(inp1[0].value) && (inp1[0].value == inp2[0].value)) {
                    alert("注册成功！");
                } else if(!regEx.test(inp1[0].value)){
                    // 提示页面
                    var tipHtml = 
                    '<div class="tips">\
                            <p class="text">'+tips1+'</p>\
                            <div class="okBtn" id="okBtn">知道了</div>\
                        </div>';
                    $("#tipMask").html(tipHtml);
                    $("#tipMask").show();
                } else if(regEx.test(inp1[0].value) && (inp1[0].value != inp2[0].value)){
                    // 提示页面
                    var tipHtml = 
                    '<div class="tips">\
                            <p class="text">'+tips2+'</p>\
                            <div class="okBtn" id="okBtn">知道了</div>\
                        </div>';
                    $("#tipMask").html(tipHtml);
                    $("#tipMask").show();
                }
    }

    /**
     * 完成界面
     */
    var todoStepTwo = function() {
        var tpl = document.getElementById("registerTwo_tpl").text;
        var	html = $.template(tpl).render();
        $("#registerOnePage").hide();
        $("#myApp").append(html);
        // 输入框绑定响应事件
        inpAnimation_regTwo();
        // 完成按钮
        $("#finish").off("click").on("click",function(){
            checkfinish($("#password_registerTwo"),$("#rePassword"),regPassword,"亲！密码不符合规则哦~","亲！两次的密码不一样哦~");
        });
    }
    /**
     * 点击监听
     */
    var actionListener = (function(){
        // 登录
        $("#login").off("click").on("click",function(){
            check($("#phone"),$("#password"),regMobile,regPassword,"亲！电话号码不正确哦~","亲！密码不符合规范哦~");
        });

        $(document).on('click','#okBtn',function(){
            $("#tipMask").hide();
        });
        // 注冊
        $("#register").off("click").on("click",function(){
            // 第一次注册，构建注册界面，后面的操作就只是显示隐藏
            if(G.lock_creatRegister){
                G.lock_creatRegister = false;
                var tpl = document.getElementById("registerOne_tpl").text;
                var	html = $.template(tpl).render();
                $("#loginPage").hide();
                $("#myApp").append(html);
                // 输入框绑定响应事件
                inpAnimation_reg();
                // 返回登录界面
                $("#backTo").off("click").on("click",function(){
                    $("#registerOnePage").hide();
                    $("#loginPage").show();
                });
                // 下一步按钮
                $("#step").off("click").on("click",function(){
                    todoStep();
                });
            }else {
                $("#registerOnePage").show();
                $("#loginPage").hide();
            }   
        });
        // 下一步
        var todoStep = function() {
            checkregister($("#phone_register"),$("#yanzhengma"),regMobile,"亲！电话号码不正确哦~","亲！验证码不正确哦~");
        };
    })();

    /**
     * 输入框-点击文字消失
     */
    var inpAnimation = (function() {
        $("#phone").focus(function(){  
            if(this.value == this.defaultValue) {  
                this.value='';  
            }  
        });  
        $("#phone").blur(function(){  
            if(this.value == '') {  
                this.value=this.defaultValue;  
            }  
        });  
        $("#password").focus(function(){  
            if(this.value == this.defaultValue) {  
                this.value='';  
                $(this).attr('type','password');
            }  
        });  
        $("#password").blur(function(){  
            if(this.value == '') {  
                this.value=this.defaultValue; 
                $(this).attr('type','text');  
            }  
        });  
    })();

    var inpAnimation_reg = function() {
         $("#phone_register").focus(function(){  
            if(this.value == this.defaultValue) {  
                this.value='';  
            }  
        });  
        $("#phone_register").blur(function(){  
            if(this.value == '') {  
                this.value=this.defaultValue;  
            }  
        });  
         $("#yanzhengma").focus(function(){  
            if(this.value == this.defaultValue) {  
                this.value='';  
            }  
        });  
        $("#yanzhengma").blur(function(){  
            if(this.value == '') {  
                this.value=this.defaultValue;  
            }  
        });  
    };

    var inpAnimation_regTwo = function() {
         $("#password_registerTwo").focus(function(){  
            if(this.value == this.defaultValue) {  
                this.value='';  
                $(this).attr('type','password');  
            }  
        });  
        $("#password_registerTwo").blur(function(){  
            if(this.value == '') {  
                this.value=this.defaultValue;
                $(this).attr('type','text');  
            }  
        });  
         $("#rePassword").focus(function(){  
            if(this.value == this.defaultValue) {  
                this.value='';  
                $(this).attr('type','password');  
            }  
        });  
        $("#rePassword").blur(function(){  
            if(this.value == '') {  
                this.value=this.defaultValue;
                $(this).attr('type','text');  
            }  
        });  
    };
})();