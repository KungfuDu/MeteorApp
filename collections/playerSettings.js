Settings = new Mongo.Collection("settings");


Meteor.methods({
  initRoom: function(){
    var room = Settings.findOne({param:"default"});
    var serv = Settings.findOne({param:"server"});
    if (room) {
      Settings.update({param:"default"},{$set:{url: '' ,videoTime : 0, state : "stop", timeServ : null,  nextVideos : [] }});

    }else {
      Settings.insert({param:"default", url : '', videoTime : 0, state : "stop", timeServ : null , nextVideos : [] });

    }
    if(serv){
      Settings.update({param:"server"} ,{$set:{ state : 'ok'}});
    }else{
      Settings.insert({param:"server" , state:'ok'});
    }
    console.log(Settings.findOne({param:"server"}));
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
    if(Settings.findOne({param:"default"}).state === 'stop' || Settings.findOne({param:"default"}).state === 'pause' ||  Settings.findOne({param:"default"}).state === 'finish' ){
      Settings.update({param:"default"},{$set:{state : "play" , timeServ : new Date().getTime()}});
    }
  },
  pauseVideo:function(time){
    if(Settings.findOne({param:"default"}).state === 'play' ){
       Settings.update({param:"default"},{$set:{state : "pause", videoTime : time , timeServ: null }});
    }
  },
  changeTime:function(time){
    if(Settings.findOne({param:"default"}).state === 'play' ){
       Settings.update({param:"default"},{$set:{videoTime : time, timeServ:  new Date().getTime()}});
    }else if (Settings.findOne({param:"default"}).state === 'pause') {
      Settings.update({param:"default"},{$set:{videoTime : time, timeServ: null}});
    }


  },
  getCurrentTime : function(){
    console.log(getTimeSpend(Settings.findOne({param:"default"})));
    return  getTimeSpend(Settings.findOne({param:"default"}));

  },
  addVideo : function(obj){
    var res   = HTTP.call("GET", "https://noembed.com/embed?url=https://www.youtube.com/watch?v="+YouTubeGetID(obj.url), function(error,res){
      if(error){
        console.log(error);
      }
      else

        Settings.update({param:"default"},{ $push: { nextVideos: {url : obj.url , id : YouTubeGetID(obj.url) , title: res.data.title, author: res.data.author_name } }});
        var room = Settings.findOne({param:"default"});
        var nextVideo = room.nextVideos[0];
        if(room.url === ""){
          Settings.update({param:"default"},{$set:{url : nextVideo.id ,state : "play" , videoTime : 0, timeServ : new Date().getTime()},
                                             $pull : {nextVideos : nextVideo}});
        }
    });

  },
  finishVideo:function(){

    var serv = Settings.findOne({param:"server"});
    console.log(serv);

    if(Settings.findOne({param:"server"}).state == 'ok'  ){
      Settings.update({param:"server"},{ $set: { state : 'wait'}});
      var room = Settings.findOne({param:"default"});
      var nextVideo = room.nextVideos[0];
      if(nextVideo !== undefined){
              Settings.update({param:"default"},{$set:{url : nextVideo.id ,state : "play" , videoTime : 0, timeServ : new Date().getTime()},
                                                 $pull : {nextVideos : nextVideo}});
      }
      Meteor.setTimeout(function () {
        Settings.update({param:"server"},{ $set: { state : 'ok'}});
      }, 3000);
      console.log(Settings.findOne({param:"server"}));
    }

  },
  newTime:function(){

  },
  nextVideo:function(){

    var room = Settings.findOne({param:"default"});
    var nextVideo = room.nextVideos[0];
    if(nextVideo !== undefined){
            Settings.update({param:"default"},{$set:{url : nextVideo.id ,state : "play" , videoTime : 0, timeServ : new Date().getTime()},
                                               $pull : {nextVideos : nextVideo}});
    }

  },
  getVideoTime : function(){

  }

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
