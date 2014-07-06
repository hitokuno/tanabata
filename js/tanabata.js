var one_deg=111263.283;
var range_m=500;
var range_deg=range_m/one_deg;
var data_url="./data/tanabata.txt";
var currentIndex=1;
var skipMax=4;
var lat;
var lng;
var GPS_interval_msec=120*1000;
var fall_interval_msec=100;
var swing_speed=10;
var fall_speed=5;
var width_speed=0.1;
var x=100,y=0,t=0;

$("#container").height(window.innerHeight-$("footer").height());
//navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
getFile();
setInterval("falling()",100);

function falling() {
  x=x+Math.sin(t) * swing_speed;
  y=y+fall_speed;
  var tanzaku=$(".tanzaku");
  if(y>window.innerHeight-tanzaku.height()) {
    y=0;
    getFile();
  }
  t=t+fall_speed;
  tanzaku.css("top",y+'px');
  tanzaku.css("left",x+'px');
//  tanzaku.css("width",(1+Math.sin(t*3))*50+'px');
/*
*/
}

function successCallback(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;
  $(".lat").html(lat);
  $(".lng").html(lng);
}

/***** 位置情報が取得できない場合 *****/
function errorCallback(error) {
  var err_msg = "";
  switch(error.code)
  {
    case 1:
    err_msg = "位置情報の利用が許可されていません";
    break;
    case 2:
    err_msg = "デバイスの位置が判定できません";
    break;
    case 3:
    err_msg = "タイムアウトしました";
    break;
  }

  setTimeout(navigator.geolocation.getCurrentPosition(successCallback, errorCallback), GPS_interval_msec);
}

function getFile() {
  jQuery.ajax({
    async: false,
    url: data_url,
    cache: false,
    dataType: 'text'
  })
  .done(function(data) {
    var files=data.split("\n");
    var found=[];
    for ( var i=0; i<files.length; i++) {
      var currentLat=files[i].split("\t")[0];
      var currentLng=files[i].split("\t")[1];
      if ( currentLat>lat+range_deg ) { continue; }
      if ( currentLat<lat-range_deg ) { continue; }
      if ( currentLng>lng+range_deg ) { continue; }
      if ( currentLng<lng-range_deg ) { continue; }
      found.push(files[i]);
    }
    window.currentIndex=window.currentIndex+Math.floor( Math.random() * skipMax )+1;
    if ( window.currentIndex > found.length-1 ) {
      window.currentIndex=window.currentIndex-found.length;
    }
//    var target=found[window.currentIndex].split("\t")[2];
    var target=found[window.currentIndex].split("\t")[2];
    console.log("Load location files:success");
    jQuery(".tanzaku").attr("src",target);
  })
  .fail(function(XMLHttpRequest, textStatus, errorThrown) {
    alert(errorThrown.message);
    console.log("Load location files:error");
    console.log(errorThrown.message);
  })
  .always(function() {
    console.log("Load location files:complete");
  });
}
