var one_deg=111263.283;
var range_m=500;
var range_deg=range_m/one_deg;
var data_url="./data/tanabata.txt";
var currentIndex=1;
var skipMax=0;
var lat;
var lng;
var GPS_interval_msec=120*1000;
var fall_interval_msec=100;
var swing_speed=10;
var fall_speed=5;
var width_speed=0.1;
var x=window.innerWidth/2,y=0,t=0;

$("#container").height(window.innerHeight-$("footer_").height());
//navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
getFile();

var Tanzaku = function(x,y,t,Img) {
  this.x=x;
  this.y=y;
  this.t=t;
  this.Img=Img;

  this.falling = function (i){
    var that = this;
    var element = $("#t1");

    that.x=that.x+(Math.sin(this.t+ t) ) * swing_speed;
//    if (that.y>=window.innderHeight-that.y) {
    if (that.y>=400) {
      that.y=0;
      that.t=that.t-Math.random();
      getFile();
    } else {
      that.y=that.y+fall_speed;
    }
    console.log(that.y);
    that.t=that.t+width_speed;
    element.css("top",that.y-200+'px');
    element.css("height",'200px');
    element.css("left",that.x+'px');
    element.css("width",(1+Math.sin(that.t*1.03))*50+'px');

    setTimeout(function(){
      that.falling(i);
    }, 100);
  };
};


var a = new Tanzaku(x,0,Math.random()+1,'aka_01.jpg');
a.falling(0);

function connect_device() {
  document.location="app://recog";
}

function change_text(message) {
  document.getElementById('result').innerHTML = message;
  document.location="app://default";
}


function getFile() {
  jQuery.ajax({
    async: true,
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
