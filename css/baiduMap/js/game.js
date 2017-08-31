/**
 * 
 * @authors xiaodong (tumi330@163.com)
 * @date    2017-08-27 
 * @version $0.1$
 */
// 1.地图信息初始化
var lat = 113.960836;
var long = 22.541311;
var isInit = true;// 是否初始化

var centerPoint = new BMap.Point(113.960836, 22.541311);
var map = new BMap.Map("container");
map.centerAndZoom(centerPoint, 18);
map.disableDragging();
map.disableDoubleClickZoom();
map.disablePinchToZoom();	

// 2.地图信息-通过微信JSSDK, 获取用户火星坐标
function wxLocation() {
    wx.ready(function () {
        wx.getLocation({
            type: 'gcj02',// 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02
            success: function (res) {
                lat=res.latitude;
                long=res.longitude; 

                // 用户同意授权，重置地图的中心坐标
                getGeolocation(lat,long);

                // 在屏幕内随机添加五个小精灵
                if(isInit){
                    setMarker();
                }
            },
            cancel: function (res) {
                // 用户未授权地理位置
                if(isInit){
                    setMarker();       
                }
            }
        });
    });
    wx.error(function (res){
        alert(res.errMsg);
    });
}

// 3.地图信息-移动地图的中心坐标
function getGeolocation(lat,long){
    var newCP = new BMap.Point(lat, long+0.0013);
    map.panTo(newCP);

    var newUserPoint = new BMap.Point(lat, long);
    map.removeOverlay(circle);
    var rangeRadius =  5*$(".game_tips .text").outerWidth()/6;
    // var rangeRadius = 150;// 范围
    circle = new BMap.Circle(newUserPoint, rangeRadius, {
        fillOpacity: 0.3,
        fillColor: "#89DEFA",
        strokeWeight: 0.1,
        strokeOpacity: 0.1
    });
    map.addOverlay(circle);
    
}

// 4.圆的初始化
// var rangeRadius = 150;// 范围
var rangeRadius =  $(".game_tips .text").outerWidth();
var circle;
circle = new BMap.Circle(centerPoint, rangeRadius, {
    fillOpacity: 0.3,
    fillColor: "#89DEFA",
    strokeWeight: 0.1,
    strokeOpacity: 0.1
});
map.addOverlay(circle);


// 5.在屏幕内随机添加五只小精灵-初始化
var marker = new Array();
var markerArr = new Array();// 记录小精灵的坐标
var markerArrOrigin = new Array();// 记录小精灵的原始坐标
var markerArrCatch = new Array();// 记录捕捉到的小精灵

// 6.随机添加五只小精灵
function setMarker(){
    var bounds = map.getBounds();
    var lngSpan = bounds.ul.lng - bounds.Ll.lng;
    var latSpan = bounds.ul.lat - bounds.Ll.lat;

    for (var i = 0; i < 5; i ++) {
        var point = new BMap.Point(bounds.Ll.lng + lngSpan * (Math.random() * 0.7 + 0.15),
            bounds.Ll.lat + latSpan * (Math.random() * 0.7 + 0.15));
        // addMarker(point, i);
        markerArr.push(point);
    }

    markerArrOrigin = markerArr;

    for (var i = 0; i < 5; i++) {
        //标记
        var t = i + 1;
        var icon = new BMap.Icon("./images/0"+t+".png",new BMap.Size(82,82),{
            // 指定定位的位置，当标注显示在地图上时，其所指向的位置距离图片左上角的位置偏移量
            anchor: new BMap.Size(41,41),
            imageOffset: new BMap.Size(0, 0 )// 设置偏移，精灵图的做法
        });
        // 创建标注对象并且添加到地图上
        marker[i] = new BMap.Marker(markerArr[i],{icon:icon});
        (function(i){
            marker[i].addEventListener("click", function(){
                catchSprite(markerArr[i]);
            });
        })(i);
        map.addOverlay(marker[i]);
    }

    isInit = false;
}

// 7.捕捉小精灵
function catchSprite(that) {
    try {
        isSprite = false;
        var catchnum = 0;
    
        for (var i=0; i<markerArr.length; i++){
            var templpoint = markerArr[i];
    
            if(circle.getBounds().containsPoint(templpoint) && templpoint == that){
                catchnum++;
                markerArrCatch.push(i);
    
                //删除已经捕获的小精灵
                map.removeOverlay(marker[i]);
    
                //添加新的小精灵
                addLostSprite(i);
            }
        }
    } catch (error) {
        alert(error);
    }
}

// 8.补充丢失的精灵
function addLostSprite(i) {
    var bounds = map.getBounds();
    var lngSpan = bounds.ul.lng - bounds.Ll.lng;
    var latSpan = bounds.ul.lat - bounds.Ll.lat;

    var point = new BMap.Point(bounds.Ll.lng + lngSpan * (Math.random() * 0.7 + 0.15),
    bounds.Ll.lat + latSpan * (Math.random() * 0.7 + 0.15));

    markerArr[i] = point;

    // var t = Math.floor(5*(Math.random())) + 1;
    var t = i + 1;
    var icon = new BMap.Icon("./images/0"+t+".png",new BMap.Size(82,82),{
        anchor: new BMap.Size(41,41),
        imageOffset: new BMap.Size(0, 0 )
    });
    marker[i] = new BMap.Marker(markerArr[i],{icon:icon});
    (function(i){
        marker[i].addEventListener("click", function(){
            catchSprite(markerArr[i]);
        });
    })(i);
    map.addOverlay(marker[i]);
}

// 8.启动整体代码，定时更新地图中心点的坐标
function foo() {

    // wxLocation();
    getGeolocation(lat,long);

    //以用户的坐标，随机添加5个喵星人
	if(isInit){
		setMarker();
	}

    //每个1秒，刷新一次地图中心点
    setInterval(foo,3000);
}

foo();