Meteor.subscribe("PlayerSettings");
var localSettings = '';

Template.videoPlayer.events({
  "blur #urlInput": function(){
       var myurl = $('#urlInput').val();
       Meteor.call('setNextVideo',{url : myurl});
  },
  "click #buttonPlay" :function(e){
    e.preventDefault();
     Meteor.call('playVideo');
  },
  "click #buttonPause" :function(e){
    e.preventDefault();

    var time = player.getCurrentTime();
    console.log(time);
     Meteor.call('pauseVideo',time);
  },
  "touchend, mouseup #progress-bar" : function(e){
    console.log(e);
    var bar = e.target.value;
    if(bar !== ''){
      var newTime = player.getDuration()*(bar/ 100);
      console.log(newTime);
      // Skip video to new time.
      Meteor.call('changeTime',newTime);
    }
  }

});

Template.videoPlayer.helpers({
  room : function(){

      var newSettings = Settings.findOne({param:"default"});

      if(localSettings === ''){
        localSettings = newSettings ;
      }
      else if(newSettings !== localSettings){
        updateSettings(newSettings);
      }
      console.log(newSettings);
      return newSettings ;
  },
  myTime : function(){
    return Meteor.call('getCurrentTime',function(error, result){
                                                  if(error){
                                                    return error;
                                                  }
                                                  else {
                                                    return result;
                                                  }
                                              });
  }

});

function updateSettings(settings){
  if ( localSettings ) {
      console.log($(localSettings));
      if( localSettings.state !== settings.state){

        console.log("aazeaeaeae");
        console.log(localSettings.state);
        console.log(settings.state);
        switch (settings.state) {
          case 'play':
            player.playVideo();
            break;
          case 'pause':
            player.pauseVideo();
            break;
          default:

        }
      }
      if( localSettings.videoTime !== settings.videoTime){
        player.seekTo(settings.videoTime);
      }
  }
  localSettings = settings;
}
function setUpSettings(){
      console.log('local');
      console.log( localSettings);
      if(localSettings){
        if(localSettings.state == 'play'){
          console.log('stat :play');
          jumpToCurrentTime();
        }
        else if(localSettings.state == 'pause'){
          console.log('stat :pause');
          console.log(localSettings.videoTime);
          player.seekTo(localSettings.videoTime);
          player.pauseVideo();
        }else if(localSettings.state == 'stop'){
          console.log('stat :stop');

        }
      }

        return true;
}

function changeState(state){
  switch(state) {
      case 'play':
          player.playVideo();
          break;
      case 'pause':
      console.log('pause action');
          player.pauseVideo();
          break;

      case 'stop':
      console.log('pause action');
          player.stopVideo();
          break;
  }
  return true;
}

function changeTime(time){
  console.log("time"+time);
  player.seekTo(time);
  return true;
}


function jumpToCurrentTime(){
 return  Meteor.call('getCurrentTime',function(error,result){
   if (error) {
     return error;
   }
   else
   return player.seekTo(result+10);
 });
}

Template.videoPlayer.rendered = function(){

  var tag = document.createElement('script');

   tag.src = "https://www.youtube.com/iframe_api";
   var firstScriptTag = document.getElementsByTagName('script')[0];
   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

   /* 3. This function creates an <iframe> (and YouTube player) */
   /*    after the API code downloads. */


   onYouTubeIframeAPIReady = function() {
     player = new YT.Player('player', {
       events: {
         'onReady' : onPlayerReady,
         'onStateChange': onPlayerStateChange

       }
     });

   };



   /* 4. The API will call this function when the video player is ready. */
    function onPlayerReady() {

      // Clear any old interval.
      setUpSettings();

      time_update_interval = setInterval(function () {
          updateProgressBar();
      }, 1000);

        //console.log(localSettings);
   }




   onPlayerStateChange = function(event) {

   };
   stopVideo = function() {
     player.stopVideo();
   };

   changeUrl = function(id){
     player.cueVideoByUrl(id);

   };
  updateProgressBar = function(){
       // Update the value of our progress bar accordingly.
       $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
   };

};
