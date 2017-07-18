/**
 * 图片裁剪上传
 * tumi330@163.com
 * 2017/7/4
 */

/*
* 裁剪图片
*/
function cutPic(that) {
    var $image = $('.container-imgmatch>img');
    var $inputImage = $(that).eq(0), URL = window.URL || window.webkitURL, blobURL;
    if (URL) {
        // 进入图片裁剪的页面
        $("#caijianBox").show();
        var files = $(that)[0].files, file;
        if (files && files.length) {
            file = files[0];

            var testContent = file.type || file.name;
            if (/^image.*$/.test(testContent)) {
                try{
                    blobURL = URL.createObjectURL(file);
                }catch(error){
                    blobURL = window.webkitURL.createObjectURL(file);
                }
                
                $image.one('built.cropper', function() {
                    URL.revokeObjectURL(blobURL); // Revoke when load complete
                }).cropper({
                    aspectRatio : 1,
                }).cropper('reset', true).cropper('replace', blobURL);
                $inputImage.val('');
            } else {
                alert('请选择一张图片.');
            }
        }
    } else {
        $inputImage.parent().remove();
    }
}

/**
 * 图片预览并上传(拼颜值图片上传代码)
 * @param $_img 预览图片的IMG对象
 * @param file 文件表单对象
 * @param errorFn 出现错误的回调函数
 */
function imgPreview($_img, file, errorFn,successFn){

    // 隐藏裁剪框
    $("#caijianBox").hide();

    var canvas = $('.container-imgmatch > img').cropper('getCroppedCanvas', {
        width : 320,
        height : 640
    });

    var Imgsrc = canvas.toDataURL("image/jpeg", 0.9);

    var files = file.files,
        img = new Image();

    if(window.URL){
        // img.src = window.URL.createObjectURL(files[0]); //创建一个object URL，并不是你的本地路径

        img.src = Imgsrc; //Imgsrc是一个object URL，并不是你的本地路径

        img.onload = function(e) {
            var src = this.src;
            $_img.attr('src', src);
            window.URL.revokeObjectURL(src); //图片加载后，释放object URL
            getImageCompressedData(successFn);
        }
        img.onerror = function(e){
            // $('#loading').stop().hide();
            file.value = '';
            errorFn();
        }
    }else if(window.FileReader){
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = function(e){
            $_img.error(function(){
                // $('#loading').stop().hide();
                file.value = '';
                errorFn();
            });
            $_img.attr('src', this.result);
            img.src = this.result;
            img.onload = function(e) {
                getImageCompressedData(successFn);
            }
        }
    }
    
    function getImageCompressedData(successFn){
        var width = img.width;
        var need_compress = false;
        if(width >= 640) {
            need_compress = true;
        }
        try{
            handleImgBase64(compress(img, need_compress), errorFn,successFn);					
        }catch(e){
            console.log(e);
        }
    }
    
    /**
     * 主要逻辑， 上传图片并比较颜值
     * @param pic 经过压缩的图片
     * @param errorFn 出现错误的回调函数
     */
    function handleImgBase64(pic, errorFn,successFn){
        var retrytime=0;
        if(pic.indexOf('base64')>0){
            pic=pic.substring(pic.indexOf('base64')+7);			
        }
        var key= "base64upload/slhb/" +new Date().getTime() + Math.round(Math.random()*100000) + '.jpg';
        var url = "http://upload.qiniu.com/putb64/-1/key/" + base64encode(key);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4){
                // $('#cover').stop().hide();
                // $('#loading').stop().hide();
                
                if(xhr.status == 200 || xhr.status == 304 || xhr.status==0){
                    $_img.attr('src', imgUrlPre + key);
                    successFn();
                    // pageOut("adjust", function(){
                    //     originImgUrl = imgUrlPre + key,
                    //     imgDeg = 0;
                        
                    // });
                }else{
                    retrytime++; 
                    //最多尝试3次
                    if(retrytime<=2){
                        handleImgBase64(pic, errorFn);		
                        return;
                    }
                    errorFn();
                }	            
            }
        }
        xhr.open("POST", url, true); 
        xhr.setRequestHeader("Content-Type", "application/octet-stream"); 
        xhr.setRequestHeader("Authorization", 'UpToken ' + uptoken); 
        xhr.send(pic);
    }
    
    /**
     * 图片压缩
     * @param source_img_obj 图片对象
     * @param need_compress 是否压缩
     * @param output_format 输出格式
     * @returns
     */
    function compress(source_img_obj, need_compress, output_format){

        var mime_type = "image/jpeg";
        if(output_format=="png"){
        mime_type = "image/png";
        }

        var cvs = document.createElement('canvas');
        var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        
        var newImageData;
        
        if(need_compress){
            if(isiOS){
                var mpImg = new MegaPixImage(source_img_obj);
                mpImg.render(cvs, { maxWidth: 420, maxHeight: 420 });
            }else{
                var maxlen=420;
                if(source_img_obj.width>source_img_obj.height){
                    cvs.width = maxlen;
                    cvs.height = source_img_obj.height*maxlen/source_img_obj.width;      		
                }else{
                    cvs.width = source_img_obj.width*maxlen/source_img_obj.height;  
                    cvs.height = maxlen;        		
                }
                cvs.getContext("2d").drawImage(source_img_obj, 0, 0,cvs.width,cvs.height);    		
            }
            newImageData = cvs.toDataURL(mime_type, 0.9);
        }else{
            if(isiOS){
                var mpImg = new MegaPixImage(source_img_obj);
                mpImg.render(cvs, { maxWidth: source_img_obj.width, maxHeight: source_img_obj.height });
            }else{
                cvs.width=source_img_obj.width;   
                cvs.height=source_img_obj.height;
                cvs.getContext("2d").drawImage(source_img_obj, 0, 0,cvs.width,cvs.height);    		
            }
            newImageData = cvs.toDataURL(mime_type, 1);
        }
        return newImageData;
    }

    /*
    * Interfaces: b64 = base64encode(data); data = base64decode(b64);
    */
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    function base64encode(str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }
}