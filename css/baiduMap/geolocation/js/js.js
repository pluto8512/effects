/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-02-09 16:28:42
 * @version $Id$
 */
//1.地图信息——腾讯地图，初始化
var lat=39.98208;
var long=116.3055;
var isInit=true;
                
var center=new qq.maps.LatLng(lat,long);
var map=new qq.maps.Map(document.getElementById("container"),{
    center:center,
  	zoom:16,//16比较合适
    disableDefaultUI: true    //禁止所有控件
});


//2.地图信息——通过微信JSSDK，获取用户火星坐标
var sharethis=function(){
var server = 'http://www.h5-share.com/h5share.php/Home/Index/JDOU_shareWx/';

var currenturl = window.location.href;
 var postData={ url:currenturl}
      ajax.ajax({
            type: "POST",
            url: server,
            data: postData,
            async: true,
            dataType: "json",
            success: function (result) {
                    //分享功能 s
                    wx.config({
                        debug: false,
                        appId: result.appId,
                        timestamp: result.timestamp,
                        nonceStr: result.nonceStr,
                        signature: result.signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone',                                
                            'openLocation',
                            'getLocation'                                
                        ]
                    });
                    wechatReady();

            },
            error: function () {
              //window.alert("系统错误，请稍后再试");
            }
        });

}


  function wechatReady() {     
        wx.ready(function () {
            var appMessageShareData = {
                title:'捕捉喵星人',
                desc: '快乐的运动，一起捕捉喵星人',
                link: 'http://www.h5-share.com/demo/geolocation/miao.html',
                imgUrl:'http://www.h5-share.com/images/logon.jpg'
             };      
             wx.onMenuShareAppMessage(appMessageShareData);
             wx.onMenuShareTimeline(appMessageShareData);
             wx.onMenuShareQQ(appMessageShareData);
             wx.onMenuShareWeibo(appMessageShareData);
             
             wx.getLocation({
              type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                lat=res.latitude;
                long=res.longitude; 
				
				//用户同意授权，重置地图坐标中心点位置
				getGeolocation(lat,long);

				//以用户的坐标，随机添加5个喵星人
				if(isInit){
					setMarker();
				}


                
              },
              cancel: function (res) {
                //用户未授权地理位置，以预设置的坐标为中心，随机添加五个喵星人
                if(isInit){
					setMarker();
				}


              }
            });
        })     
        wx.error(function (res) {
             // alert(res.errMsg);
        });
    }


//3.地图信息——移动地图中心坐标
function getGeolocation(lat,long) {
  var newP2=new qq.maps.LatLng(lat,long);
  map.panTo(newP2);  
  circle.setCenter(newP2);
  circlePoint.setCenter(newP2);  
}


//4.大网——初始化
//大圈的范围区域
var rangeRadius=200;
var circle=new qq.maps.Circle({
    map:map,
    center:center,
    radius:rangeRadius,//200比较合适
    fillColor:new qq.maps.Color(28,142,207,0.5),
    strokeWeight:0
});

//点
var circlePoint=new qq.maps.Circle({
    map:map,
    center:center,
    radius:5,//200比较合适
    fillColor:new qq.maps.Color(28,142,207,1),
    strokeWeight:0
});


//5.随机添加5个喵星人——初始化
var anchor = new qq.maps.Point(41, 41),
size = new qq.maps.Size(82, 82),
origin = new qq.maps.Point(0, 0),
marker=new Array();
var markerArr=new Array(); //记录喵星人坐标
var markerArrOrigin=new Array(); //记录喵星人坐标原始数据
var markerArrCatch= new Array(); //记录捕捉到的喵星人


//6.随机添加5个喵星人——每只喵星人的随机位置
function radnomLatLon(wlat,wlon,wRadius){
  var randomAngle=Math.floor(Math.random()*360);

  //经度上，1度等于111km
  var du=Math.PI/360;
  var sindis=(wRadius*Math.sin(du*randomAngle))/111000;
  var cosdis=(wRadius*Math.cos(du*randomAngle))/111000;
  
  var randfuhaoLat=Math.floor(Math.random()*2);
  var randfuhaoLon=Math.floor(Math.random()*2);

  var vLon=new Array(cosdis,-cosdis); //经度
  var vLat=new Array(sindis,-sindis); //纬度

  var nowLon=wlon+vLon[randfuhaoLon];
  var nowLat=wlat+vLat[randfuhaoLat];
  var nowPos=new Array(nowLat,nowLon);
  return nowPos;
}



//7.随机添加5个喵星人——记录各个信息，添加5只喵星人
function setMarker(){
  for(var i=0;i<5;i++){
    var t=i+1;
    var randRadius=Math.floor(Math.random()*rangeRadius*3*t);
    markerArr.push(radnomLatLon(lat,long,randRadius));
  }

  markerArrOrigin=markerArr;

  for(var i=0;i<5;i++){
    //标记
    var t=i+1;        
    var icon= new qq.maps.MarkerImage('http://www.h5-share.com/demo/geolocation/miaoxingren/82/0'+t+'.png', size, origin, anchor);
    marker[i]= new qq.maps.Marker({
        position: new qq.maps.LatLng(markerArr[i][0],markerArr[i][1]),
        map: map,
        icon: icon
    });
  }

  isInit=false;
}


//8.捕捉喵星人
function catchMiao() {
    isMiao=false; 
    var catchnum=0;

    for(var i=0;i<markerArr.length;i++){
      var templat=markerArr[i][0];
      var templon=markerArr[i][1];

       if(circle.getBounds().contains(new qq.maps.LatLng(templat,templon))){
          catchnum++;
          markerArrCatch.push(i);

          //删除已经捕获的喵星人
          markerArr.splice(i,1);
          marker[i].setMap(null);
          marker.splice(i,1);

          i= i-1;
       }
    } 

  var freeMiaoNum=markerArr.length;
  var catchMiaoNum=5-freeMiaoNum;

  var balabala='一共5只喵星人，你已经捕捉到'+catchMiaoNum+'两只喵星人~'

  if(catchMiaoNum<=0){
    balabala='5只喵星人都已经捕捉到了，超级厉害~~'
  }

  document.getElementById('miaotip').innerHTML=balabala;

  }     
  qq.maps.event.addListener(circle, 'click', catchMiao);


//9.启动整体代码，定时更新地图中心点坐标
function foo(){
  //sharethis();
  getGeolocation(lat,long);

	//以用户的坐标，随机添加5个喵星人
	if(isInit){
		setMarker();
	}
  //每个1秒，刷新一次地图中心点
  setTimeout(foo, 1000);
}

foo();


