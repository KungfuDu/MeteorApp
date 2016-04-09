Settings = new Mongo.Collection("settings");


Meteor.methods({
  setNextVideo: function(obj){
    console.log(Meteor.user().username);
    if (Settings.findOne({param:"default"})) {
      Settings.update({param:"default"},{$set:{url: YouTubeGetID(obj.url) ,videoTime : 0, state : "stop", timeServ : null}});

    }else {
      Settings.insert({param:"default", url : YouTubeGetID(obj.url), videoTime : 0, state : "stop", timeServ : null });

    }
  },
  startWatching:function(){
   // if room exist
   //   add user to room
   //   return room setting (url time playlist)
   // else
   //   create room
   //   add user //  as admin
 },
  playVideo:function(){
    if(Settings.findOne({param:"default"}).state === 'stop' || Settings.findOne({param:"default"}).state === 'pause'){
      Settings.update({param:"default"},{$set:{state : "play" , timeServ : new Date().getTime()}});
    }
  },
  pauseVideo:function(time){
    if(Settings.findOne({param:"default"}).state === 'play' ){
       Settings.update({param:"default"},{$set:{state : "pause", videoTime : time , timeServ: null }});
    }
  },
  changeTime:function(time){
    Settings.update({param:"default"},{$set:{videoTime : time}});

  },
  stopVideo:function(){

  },
  newTime:function(){

  },
  nextVideo:function(){

  },
  getVideoTime : function(){

  },
  getCurrentTime : function(){

    return  getTimeSpend(Settings.findOne({param:"default"}));


  },

});


function YouTubeGetID(url){
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url;
  }
    return ID;
}

function getTimeSpend(setting){
  return setting.videoTime+( new Date().getTime() - setting.timeServ )/1000;
}
