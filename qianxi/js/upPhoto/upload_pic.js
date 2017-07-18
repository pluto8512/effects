function UploadPic(){}
/* 检测图片 */
UploadPic.prototype.imgCheck = function(file){
	var files = file.files,
		img = new Image(),
		dtd = $.Deferred();

	img.onload = function(e) {
		if(!window.FileReader)
			window.URL.revokeObjectURL(img.src); //图片加载后，释放object URL

		dtd.resolve(img);
	}
	img.onerror = function(e){
		dtd.reject();
	}
	if(window.FileReader){
		var reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = function(e){
			img.src = this.result;
		}
	} else if(window.URL){
		img.src = window.URL.createObjectURL(files[0]); //创建一个object URL，并不是你的本地路径
	}

	return dtd.promise();
}
/* 图片预览 */
UploadPic.prototype.imgPreview = function(imgDom, fileDom, fn){
	var ctx = this;

	this.imgCheck(fileDom).then(function(img){
		var width = img.width;
		var need_compress = false;
		if(width >= 640) {
			need_compress = true;
		}

		var imgData = img.src;
		try{
			imgData = ctx.compress(img, need_compress);
		}catch(e){
			console.error(e);
			ctx.errorTip('图片处理出现未知错误！');
		}

		if(imgDom.length){
			Array.prototype.forEach.call(imgDom, function(n, i){
				n.src = imgData;
			});
		} else if(imgDom.nodeName == 'img') {
			imgDom.src = imgData;
		}
		
		img = null;

		if(typeof fn == 'function') fn(imgData);
	}, function(){
		ctx.errorTip('图片错误或损坏');
	}).always(function(){
		fileDom.value = '';
	});
}
/**
 * 图片压缩
 * @param source_img_obj 图片对象
 * @param need_compress 是否压缩
 * @param output_format 输出格式
 * @returns
 */
UploadPic.prototype.compress = function(source_img_obj, need_compress, output_format){
	var mime_type = 'image/jpeg';
	if(output_format == 'png'){
	   mime_type = 'image/png';
	}

	var cvs = document.createElement('canvas');
	var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	
	var newImageData;
	
	if(need_compress){
		if(isiOS){
			var mpImg = new MegaPixImage(source_img_obj);
			mpImg.render(cvs, { maxWidth: 640, maxHeight: 640 });
		}else{
			var maxlen=640;
			if(source_img_obj.width>source_img_obj.height){
				cvs.width = maxlen;
				cvs.height = source_img_obj.height*maxlen/source_img_obj.width;      		
			}else{
				cvs.width = source_img_obj.width*maxlen/source_img_obj.height;  
				cvs.height = maxlen;        		
			}
			cvs.getContext('2d').drawImage(source_img_obj, 0, 0,cvs.width,cvs.height);    		
		}
		newImageData = cvs.toDataURL(mime_type, 0.8);
	}else{
		if(isiOS){
			var mpImg = new MegaPixImage(source_img_obj);
			mpImg.render(cvs, { maxWidth: source_img_obj.width, maxHeight: source_img_obj.height });
		}else{
			cvs.width=source_img_obj.width;   
			cvs.height=source_img_obj.height;
			cvs.getContext('2d').drawImage(source_img_obj, 0, 0,cvs.width,cvs.height);    		
		}
		newImageData = cvs.toDataURL(mime_type, 1);
	}
	return newImageData;
}
/**
 * @param imageData base64的图片
 * @param errorFn 出现错误的回调函数
 */
var retryTime = 3;

UploadPic.prototype.uploadImgByBase64 = function(imageData, successFn, errorFn, isRetry){
	if(!isRetry){
		retryTime = 3;
	}
	var key= 'base64upload/' + proj + '/' + new Date().getTime() + Math.round(Math.random()*100000) + '.jpg',
		url = 'http://upload.qiniu.com/putb64/-1/key/' + base64encode(key),
		xhr = new XMLHttpRequest(),
		ctx = this;

	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4){
			 if(xhr.status == 200){
				 var rt = xhr.responseText;
				 if(!rt.code || !rt.hash || !rt.key || !rt.error){
					 rt = JSON.parse(rt);
				 }
				 if(rt.error){
					 errorFn('错误' + rt.code + ':' + rt.error);
				 } else if(rt.key) {
					 var src = imgUrlPre + key;
					 successFn(src);
				 }
			 }else{
				 if(-- retryTime >= 0){
					 // 重试3次
					 ctx.uploadImgByBase64(imageData, successFn, errorFn, true);
				 } else {
					 var src = imgUrlPre + key;
					 errorFn(src);
				 }
			 }     
		}
	}
	if(imageData.indexOf('base64') > 0){
		imageData = imageData.substring(imageData.indexOf('base64') + 7);			
	}

	xhr.open('POST', url, true); 
	xhr.setRequestHeader('Content-Type', 'application/octet-stream'); 
	xhr.setRequestHeader('Authorization', 'UpToken ' + uptoken); 
	imageData.timeStamp = Math.random();
	xhr.send(imageData);
}
/*
 * Interfaces: b64 = base64encode(data); data = base64decode(b64);
 */
function base64encode(str) {
	var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
	var out, i, len;
	var c1, c2, c3;
	len = str.length;
	i = 0;
	out = '';
	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt((c1 & 0x3) << 4);
			out += '==';
			break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt((c2 & 0xF) << 2);
			out += '=';
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