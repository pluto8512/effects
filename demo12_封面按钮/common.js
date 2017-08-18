// @e-mail：tumi330@163.com
/**
 * 移动端适配
 * 针对640的设计图
 */
;(function (doc, win) {
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

/**
 * 补足位数的操作
 */
function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

/* $(".test1").wordLimit(); 自动获取css宽度进行处理，如果css中未对.test1给定宽度，则不起作用
 *	$(".test2").wordLimit(24); 截取字符数，值为大于0的整数，这里表示class为test2的标签内字符数最多24个
 */
(function($){
	$.fn.wordLimit = function(num){	
		this.each(function(){	
			if(!num){
				var copyThis = $(this.cloneNode(true)).hide().css({
					'position': 'absolute',
					'width': 'auto',
					'overflow': 'visible'
				});	
				$(this).after(copyThis);
				if(copyThis.width()>$(this).width()){
					$(this).text($(this).text().substring(0,$(this).text().length-4));
					$(this).html($(this).html()+'...');
					copyThis.remove();
					$(this).wordLimit();
				}else{
					copyThis.remove(); //清除复制
					return;
				}	
			}else{
				var maxwidth=num;
				if($(this).text().length>maxwidth){
					$(this).text($(this).text().substring(0,maxwidth));
					$(this).html($(this).html()+'...');
				}
			}					 
		});
	}
	// 获取字符数 
	$.fn.wordNum = function (string){
		var str,
			word=0,
			num=0,
			space=0,
			other=0;
			
		str = string.replace(/[a-zA-Z]/g,'');
		word = string.length - str.length;
			
		string = str;
			
		str = string.replace(/\d/g,'');
		num= string.length - str.length;
			
		string = str;
			
		str = string.replace(/ /g,'');
		space= string.length - str.length;
			
		other= str.length;
			
		return {
			"word":word,
			"num":num,
			"space":space,
			"other":other
		};
	}
	//禁止页面滑动
	$.fn.forbidSlide = function(sel,event) {
		$(sel).on(event , function(e){
			e.preventDefault();	
		});  
	}   
})(jQuery);