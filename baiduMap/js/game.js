/**
 * 
 * @authors xiaodong (tumi330@163.com)
 * @date    2017-08-27 
 * @version $0.1$
 */

/**
 * 数据
 */
var DATA = {
    // 店铺
    "store":{
        "num":1,
        "lat":113.960836,
        "long":22.569611,
        "logUrl":""
    },
    // 玩家
    "player":{
        "lat":113.960836,
        "long":22.541311,
        "headImg":""
    },
    // map'center
    "mapCenter":{
        "lat":113.960836,
        "long":22.542611
    },
    // All Mark
    "finallyMark":[],
    // mark'
    "mark":{
        "kinds":5
    },
    // test
    "test":{
        "img":"./images/userDefineMark.jpg"
    }
};


// 1.地图信息初始化
// var originLat = 113.960836;
// var originLong = 22.541311;
// var lat = 113.960836;
// var long = 22.541311;
// var storeLat = 113.960836;
// var storelong = long+0.0013;

// var testImg = "./images/userDefineMark.jpg";

// var isInit = true;// 是否初始化

// var store = {
//     "lat":113.960836,
//     "long":22.549611,
//     "imgUrl":"./images/userDefineMark.jpg",
//     "point":new BMap.Point(113.960836, 22.549611)
// };

var userPoint = new BMap.Point(DATA.player.lat, DATA.player.long); //用户坐标点
var centerPoint = new BMap.Point(DATA.mapCenter.lat, DATA.mapCenter.long); //地图中心坐标点
var storePoint = new BMap.Point(DATA.store.lat, DATA.store.long); //店铺坐标点
var circle; //玩家捕捉范围

$("#_gameTips").hide();
$("#_awardBtn").hide();
$("#_walletBtn").hide();
var map = new BMap.Map("container");
map.centerAndZoom(centerPoint , 18);
map.setMapStyle({style:'bluish'});
// map.disableDragging();
map.disableDoubleClickZoom();
map.disablePinchToZoom();

var walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: true}});
walking.search(userPoint, storePoint );


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
                GAMECOMMON.pop();
                $(".commonPop .content").text('请确保打开手机"定位服务",否则无法参与活动哦~');
            }
        });
    });
    wx.error(function (res){
        GAMECOMMON.pop();
        $(".commonPop .content").text(res.errMsg);
    });
}

// 3.地图信息-移动地图的中心坐标
function getGeolocation(pramLat,pramLong){

    userPoint = new BMap.Point(pramLat, pramLong);
    map.removeOverlay(circle);
    circle = new BMap.Circle(userPoint, rangeRadius, {
        fillOpacity: 0.3,
        fillColor: "#89DEFA",
        strokeWeight: 0.1,
        strokeOpacity: 0.1
    });
    map.addOverlay(circle);

    playerMarker.setPosition(userPoint);
    circleMarker.setPosition(userPoint);

}

// 4.圆的初始化
var rangeRadius =  (3.3)*$(".game_tips .text").outerWidth();
console.log(rangeRadius);
circle = new BMap.Circle(userPoint, rangeRadius, {
    fillOpacity: 0.3,
    fillColor: "#89DEFA",
    strokeWeight: 0.1,
    strokeOpacity: 0.1
});
map.addOverlay(circle);
var circle1 = new BMap.Circle(storePoint, 200, {
    fillOpacity: 0.3,
    fillColor: "#89DEFA",
    strokeWeight: 0.1,
    strokeOpacity: 0.1
});
map.addOverlay(circle1);

// 5.在屏幕内随机添加五只小精灵-初始化
var marker = new Array(); //mark
var markerArr = new Array(); //精灵的坐标点
var markerArrOrigin = new Array(); //记录小精灵的原始坐标点
var markerArrCatch = new Array(); //记录捕捉到的小精灵经纬度
var iconArr = new Array(); //图标样式

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
            anchor: new BMap.Size(41,82),
            imageOffset: new BMap.Size(0, 0 )// 设置偏移，精灵图的做法
        });
        // 创建标注对象并且添加到地图上
        marker[i] = new BMap.Marker(markerArr[i],{icon:icon});
        (function(i){
            BMapLib.EventWrapper.addListener( marker[i], 'click', function(e){
                catchSprite(markerArr[i]);
            });
        })(i);
        map.addOverlay(marker[i]);
    }

    isInit = false;
}
// 6*.随机添加小精灵方法扩展(首屛添加小精灵，保存到cookie)
function setMarkerExtend(){
    var bounds = map.getBounds();
    var lngSpan = bounds.ul.lng - bounds.Ll.lng;
    var latSpan = bounds.ul.lat - bounds.Ll.lat;

    for (var i = 0; i < 100; i ++) {
        var point = new BMap.Point(bounds.Ll.lng + lngSpan * (Math.random() * 0.7 + 0.15),
            bounds.Ll.lat + latSpan * (Math.random() * 0.8 + 0.1));
        markerArr.push(point);
    }

    markerArrOrigin = markerArr;

    for (var i = 0; i < 5; i++) {
        //标记
        var t = i + 1;
        var icon = new BMap.Icon("./images/0"+t+".png",new BMap.Size(82,82),{
            // 指定定位的位置，当标注显示在地图上时，其所指向的位置距离图片左上角的位置偏移量
            anchor: new BMap.Size(41,82),
            imageOffset: new BMap.Size(0, 0 )// 设置偏移，精灵图的做法
        });
        iconArr.push(icon);
    }

    // 筛选要留下的精灵
    var s,units,myDis,tempArr_01 = new Array(),tempArr_12 = new Array(),tempArr_23 = new Array(),tempArr_34 = new Array(),tempArr_45 = new Array(),tempArr_2 = new Array();
    for (var i = 0; i < 100; i++){
         // 创建标注对象并且添加到地图上
         s = (map.getDistance(storePoint,userPoint).toFixed(4));
         units = s/5;
         myDis =  (map.getDistance(storePoint,markerArr[i])).toFixed(4);
         myDis_2 = (map.getDistance(userPoint,markerArr[i])).toFixed(4);

         if(myDis < units && myDis >= 0) {
            tempArr_01.push(markerArr[i]);
         }else if(myDis < 2*units && myDis >= units){
            tempArr_12.push(markerArr[i]);
         }else if(myDis < 3*units && myDis >= 2*units) {
            tempArr_23.push(markerArr[i]);
         }else if(myDis < 4*units && myDis >= 3*units){
            tempArr_34.push(markerArr[i]);
         }else if(myDis < 5*units && myDis >= 4*units){
            tempArr_45.push(markerArr[i]);
         }

         if(myDis_2 < circle.rangeRadius){
            tempArr_2.push(markerArr[i]);
         }
    }
    if(tempArr_01.length >= 8){
        for (var i = 0; i < 8; i++){
            DATA.finallyMark.push(tempArr_01[i]);
        }
    }else {
        for (var i = 0; i < tempArr_01.length; i++){
            DATA.finallyMark.push(tempArr_01[i]);
        }
    }
    if(tempArr_12.length >=7){
        for (var i = 0; i < 7; i++){
            DATA.finallyMark.push(tempArr_12[i]);
        }
    }else {
        for (var i = 0; i < tempArr_12.length; i++){
            DATA.finallyMark.push(tempArr_12[i]);
        }
    }
    if(tempArr_23.length >=1){
        for (var i = 0; i < 1; i++){
            DATA.finallyMark.push(tempArr_23[i]);
        }
    }else {
        for (var i = 0; i < tempArr_23.length; i++){
            DATA.finallyMark.push(tempArr_23[i]);
        }
    }
    if(tempArr_34.length >=1){
        for (var i = 0; i < 1; i++){
            DATA.finallyMark.push(tempArr_34[i]);
        }
    }else {
        for (var i = 0; i < tempArr_34.length; i++){
            DATA.finallyMark.push(tempArr_34[i]);
        }
    }
    if(tempArr_45.length >=1){
        for (var i = 0; i < 3; i++){
            DATA.finallyMark.push(tempArr_45[i]);
        }
    }else {
        for (var i = 0; i < tempArr_34.length; i++){
            DATA.finallyMark.push(tempArr_45[i]);
        }
    }
    if(tempArr_2.length >= 3){
        for (var i = 0; i < 3; i++){
            DATA.finallyMark.push(tempArr_2[i]);
        }
    }else {
        for (var i = 0; i < tempArr_2.length; i++){
            DATA.finallyMark.push(tempArr_2[i]);
        }
    }
    //添加到玩家范围内
    var arr = critical(DATA.player.lat,DATA.player.long,0.0001,circle);
    for(var i = 0 ; i < arr.length ; i++){
        DATA.finallyMark.push(arr[i]);
    }
    //添加到店铺
    var arr1 = critical(DATA.store.lat,DATA.store.long,0.0001,circle1);
    for(var i = 0 ; i < arr1.length ; i++){
        DATA.finallyMark.push(arr1[i]);
    }

    for (var i = 0; i < DATA.finallyMark.length; i++){
        marker[i] = new BMap.Marker(DATA.finallyMark[i],{icon:iconArr[Math.floor((DATA.mark.kinds-1)*Math.random()+1)]});
        (function(i){
            BMapLib.EventWrapper.addListener( marker[i], 'click', function(e){
                catchSprite(DATA.finallyMark[i]);
            });
        })(i);
        map.addOverlay(marker[i]);
    }
    // addMarkBasis(storePoint,userPoint);
    // var firstScreenMarkerParams = new Array();
    // var firstScreenMarker = new Array();
    // var bounds = map.getBounds();
    // var lngSpan = bounds.ul.lng - bounds.Ll.lng;
    // var latSpan = bounds.ul.lat - bounds.Ll.lat;

    // var unitlngs = lngSpan/10;
    // var unitlats = latSpan/10;

    // var marker = new BMap.Marker( new BMap.Point(bounds.Ll.lng + 1*unitlngs,bounds.Ll.lat + 1*unitlats));// 创建标注，标注的默认样式是红色的点
    // map.addOverlay(marker);

    // for(var i=0; i<10; i++){
    //     for(var j=0; j<10; j++){
    //         var point =  new BMap.Point(bounds.Ll.lng + i*unitlngs,bounds.Ll.lat + j*unitlats);
    //         var distance =  (map.getDistance(storePoint,point)).toFixed(4);
    //         var initMark = {
    //             "POINT":point,
    //             "DISTANCE":distance
    //         };
    //         firstScreenMarkerParams.push(initMark);
    //     }
    // }

    // // 排序
    // var firstScreenMarkerParams = GAMECOMMON.maopao(firstScreenMarkerParams,"DISTANCE");

    // for (var i = 0; i < 20; i++){
    //     var t = Math.floor(Math.random()*5 + 1);
    //     var icon = new BMap.Icon("./images/0"+t+".png",new BMap.Size(82,82),{
    //         // 指定定位的位置，当标注显示在地图上时，其所指向的位置距离图片左上角的位置偏移量
    //         anchor: new BMap.Size(41,82),
    //         imageOffset: new BMap.Size(0, 0 )// 设置偏移，精灵图的做法
    //     });
    //     firstScreenMarker[i] = new BMap.Marker(firstScreenMarkerParams[i]["POINT"],{icon:icon});
    //     //创建标注并添加地图上
    //     // if(i <= 5){
    //     //     firstScreenMarker[i] = new BMap.Marker(firstScreenMarkerParams[i]["POINT"],{icon:icon});
    //     // }else{
    //     //     firstScreenMarker[i] = new BMap.Marker(
    //     //         firstScreenMarkerParams[Math.floor(Math.random()*(firstScreenMarkerParams.length-5))+5+1]["POINT"]
    //     //         ,{icon:icon});
    //     // }   
    //     map.addOverlay(firstScreenMarker[i]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    // }

    isInit = false;
}

// 7.捕捉小精灵
function catchSprite(that) {
    try {
        isSprite = false;
        var catchnum = 0;
    
        for (var i=0; i<DATA.finallyMark.length; i++){
            var templpoint = DATA.finallyMark[i];
    
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
        GAMECOMMON.pop();
        $(".commonPop .content").text(error);
    }
}

// 8.补充丢失的精灵
function addLostSprite(i) {
    var bounds = map.getBounds();
    var lngSpan = bounds.ul.lng - bounds.Ll.lng;
    var latSpan = bounds.ul.lat - bounds.Ll.lat;

    var point = new BMap.Point(bounds.Ll.lng + lngSpan * (Math.random() * 0.7 + 0.15),
    bounds.Ll.lat + latSpan * (Math.random() * 0.7 + 0.15));

    DATA.finallyMark[i] = point;

    marker[i] = new BMap.Marker(DATA.finallyMark[i],{icon:iconArr[Math.floor((DATA.mark.kinds-1)*Math.random()+1)]});
    (function(i){
        BMapLib.EventWrapper.addListener( marker[i], 'click', function(e){
            catchSprite(DATA.finallyMark[i]);
        });
    })(i);
    map.addOverlay(marker[i]);
}

// 9.添加自定义marker
var w = $("#reference .playerOfmap").outerWidth()/2;
var h = $("#reference .playerOfmap").outerHeight()/2;
var htm = '<div class="playerOfmap">'+
                "<img src="+DATA.test.img+">"+
           '</div>',
playerMarker = new BMapLib.RichMarker(htm,  userPoint,{
                                   "anchor" : new BMap.Size(-w, -h),
                                   "enableDragging" : true});


var w1 = $("#reference .storeOfmap").outerWidth()/2;
var h1 = $("#reference .storeOfmap").outerHeight()
var htm1 = '<div class="storeOfmap">'
                '<div class="headImg">' +
                    '<img src='+DATA.test.img+'>' +
                '</div>'+
           '</div>',
storeMarker = new BMapLib.RichMarker(htm1,  storePoint,{
                                   "anchor" : new BMap.Size(-w1, -h1),
                                   "enableDragging" : true});

var w2 = $("#reference .circleOfmap").outerWidth()/2;
var h2 = $("#reference .circleOfmap").outerHeight()/2;
var htm2 ='<div class="circleOfmap">'+
          '</div>',
circleMarker = new BMapLib.RichMarker(htm2, userPoint,{
                                   "anchor" : new BMap.Size(-w2, -h2),  
                                   "enableDragging" : true});

// 10.启动整体代码，定时更新地图中心点的坐标
function foo() {

    // if(lat == originLat && long == originLong){
    //     console.log(1);
    // }else {
    //     originLat = lat;
    //     originLong = long;
    //     // wxLocation();
    //     getGeolocation(lat,long);
    // }
    // long = long + 0.0001;//模拟坐标变动
    var pramLat = DATA.player.lat;
    var pramLong = DATA.player.long;
    getGeolocation(pramLat,pramLong);
    // 重置路线
    walking.clearResults();
    walking.disableAutoViewport();
    walking.search(userPoint, storePoint);
    
    //以用户的坐标，随机添加5个喵星人
	// if(isInit){
	// 	setMarker();
	// }
    
}
setTimeout(function(){
    // $("#container").animateCss('flipInY',function(){
        $("html,body").css("background","#fff");
        // $("#container").animateCss('rubberBand',function(){
            $("#_gameTips").show();
            // $("#_gameTips").animateCss('hinge',function(){
                $("#_awardBtn").show();
                $("#_walletBtn").show();
                $("#_gameTips .text").text("已经为你规划最佳寻宝路线，越靠近这里红包数额越大，中奖概率越高");
                $("#_awardBtn").animateCss('fadeInDown',function(){
                    $("#_awardBtn").animateCss('tada',function(){
                        $("#_walletBtn").animateCss('tada',function(){
                            $("#_gameTips").animateCss('tada');
                        });
                    });
                });
                $("#_gameTips").animateCss('fadeInDown');
                $("#_walletBtn").animateCss('fadeInDown');
            // });
        // });
    // });
},3990);
setTimeout(function(){
    map.addOverlay(playerMarker);
    map.addOverlay(circleMarker);
    map.setZoom(16);
    DATA.mapCenter.lat = DATA.player.lat;
    DATA.mapCenter.long = DATA.player.long+0.0048;
    centerPoint = new BMap.Point(DATA.mapCenter.lat, DATA.mapCenter.long);
    map.setCenter(centerPoint);
    foo();
    setInterval(foo,30000);
},4000); //地图的移动必须要在地图加好以后

map.addOverlay(storeMarker);
setTimeout(setMarkerExtend,2800);


// *.other
function radnomLatLon(wlat,wlon,wRadius){ //小精灵的随机位置
    var randomAngle=Math.floor(Math.random()*360);
    // i++;
    // var randomAngle = i;
  
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
    return nowPos; //返回经度和纬度 
}
/**
 * 首屛添加坐标
 * @param {店铺坐标} point1 
 * @param {用户坐标} point2 
 */
function addMarkBasis(point1,point2){// 以随机角度和半径为基础在点周围的圆周上添加小精灵
    // 1.算出用户和商家的距离
    var distance =  (map.getDistance(point1,point2)).toFixed(2);
    // 2.将距离分成十份
    var unitDistance = distance/2;
    // 3.添加标记
    for(var i = 0 ; i < 360; i++){
        // var tmplDistance = i*unitDistance/5; 
        var tmplDistance = unitDistance; 
        markerArr.push(radnomLatLon(storeLat,storelong,tmplDistance));
    }
    // 4.标记添加到地图
    for (var i = 0; i < 20; i++){
        var t = Math.floor(Math.random()*5 + 1);
        var icon = new BMap.Icon("./images/0"+t+".png",new BMap.Size(82,82),{
            // 指定定位的位置，当标注显示在地图上时，其所指向的位置距离图片左上角的位置偏移量
            anchor: new BMap.Size(41,82),
            imageOffset: new BMap.Size(0, 0 )// 设置偏移，精灵图的做法
        });
        var point = new BMap.Point(markerArr[i][0], markerArr[i][1]);
        firstScreenMarker[i] = new BMap.Marker(point , {icon:icon});
        //创建标注并添加地图上
        // if(i <= 5){
        //     firstScreenMarker[i] = new BMap.Marker(firstScreenMarkerParams[i]["POINT"],{icon:icon});
        // }else{
        //     firstScreenMarker[i] = new BMap.Marker(
        //         firstScreenMarkerParams[Math.floor(Math.random()*(firstScreenMarkerParams.length-5))+5+1]["POINT"]
        //         ,{icon:icon});
        // }   
        map.addOverlay(firstScreenMarker[i]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    }

}  
/**
 * 边界判断
 * @param {经度} lat 
 * @param {纬度} long 
 * @param {常量} c
 * @param {范围} mycircle
 */
function critical(lat,long,c,mycircle) {
    var target_lat,target_long,Arr = new Array();
    for (var i = 1; i <= 100; i++) {
        var a = lat + i*c;
        var b = long;
        var point_target = new BMap.Point(a, b);
        if(mycircle.getBounds().containsPoint(point_target) && i!=100) {
            continue;
        }else if(mycircle.getBounds().containsPoint(point_target) && i==100){
            target_lat = a;
        }else if(!mycircle.getBounds().containsPoint(point_target) && i==1){
            console.log("c太大");
            target_lat = lat;
            break;
        }else if(!mycircle.getBounds().containsPoint(point_target) && i!=100){
            target_lat = a - c;
        }
    }
    for (var i = 1; i <= 100; i++) {
        var a = lat;
        var b = long + i*c;
        var point_target = new BMap.Point(a, b);
        if(mycircle.getBounds().containsPoint(point_target) && i!=100) {
            continue;
        }else if(mycircle.getBounds().containsPoint(point_target) && i==100){
            target_long = b;
        }else if(!mycircle.getBounds().containsPoint(point_target) && i==1){
            console.log("c太大");
            target_long = long;
            break;
        }else if(!mycircle.getBounds().containsPoint(point_target) && i!=100){
            target_lat = b - c;
        }
    }
    //绝对值
    var d = target_lat - lat;
    var e = target_long - long;

    // for (var i = 0; i < 2; i ++) {
    //     // var point = new BMap.Point((long-e) + 2*e * (Math.random() * 0.7 + 0.15),
    //     //     (lat-d) + 2*d * (Math.random() * 0.8 + 0.1));
    //     var point = new BMap.Point(lat + d, long + e);
    //     Arr.push(point);
    // }

    var point = new BMap.Point(DATA.player.lat, DATA.player.long);

    var  marker = new BMap.Marker(point);
    map.addOverlay(marker);

    Arr.push(point);
    // var point1 = new BMap.Point(DATA.player.lat, DATA.player.long);
    // Arr.push(point1);

    return Arr;
}