Meteor.subscribe("PlayerSettings");
var localSettings = '';
var player=null;
var rdy = false;
var time_update;

Template.videoPlayer.created = function(){
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  console.log('ok wesh');
};



// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// onYouTubeIframeAPIReady = function(){
//   rdy = true;
// };
//  onYouTubeIframeAPIReady = function(){
//       console.log("youtube api rdy");
//       player = new YT.Player('player', {
//         videoId: localSettings.url,
//         playerVars: {'controls': 1 },
//         events: {
//           'onStateChange': onStateChange,
//           'onReady' : onPlayerReady,
//         }
//       });
// };

Template.videoPlayer.events({

  "click #initRoom": function(e){
    e.preventDefault();
    Meteor.call('initRoom');
  },
  "click #buttonAdd" :function(e){
    e.preventDefault();

    var res = $('#nextInput').val();
    $('#nextInput').val('');
    console.log('addVideo');
     Meteor.call('addVideo',{url : res});
  },
  "click #buttonPlay" :function(e){
    e.preventDefault();
    Meteor.call('playVideo');
    console.log(player.getPlayerState());
  },
  "click #buttonNext" :function(e){
    e.preventDefault();
    //Meteor.clearInterval(time_update);
    console.log(player);
    //player = null;
    //Meteor.call('finishVideo');
     Meteor.call('nextVideo');

  },
  "click #buttonPause" :function(e){
    e.preventDefault();

    var time = player.getCurrentTime();
     //Meteor.clearInterval(time_update);
     Meteor.call('pauseVideo',time);
  },
  "touchend, mouseup #progress-bar" : function(e){
    var bar = e.target.value;
    if(player){
      if(bar !== ''){
        var newTime = player.getDuration()*(bar/ 100);
        console.log(newTime);
        // Skip video to new time.
        Meteor.call('changeTime',newTime);
      }
    }

  },
  "touchend, mouseup #volume-bar" : function(e){
    var bar = e.target.value;
    if(player){
      if(bar !== ''){
        player.setVolume(bar);

      }
    }

  },
  "load #player": function(e){

    e.preventDefault();

   }

});

Template.videoPlayer.helpers({
    room : function(){

      var newSettings = Settings.findOne({param:"default"});

      if (newSettings) {
        updateSettings(newSettings);

        localSettings = newSettings;
      }

      return  localSettings;
    }

});

function updateSettings(settings){
      console.log(settings);

      if(player){
          console.log('ya un  player');
        if( localSettings.url !== settings.url){
          player.loadVideoById(settings.url);
        }
        if( localSettings.videoTime !== settings.videoTime){
          player.seekTo(settings.videoTime);
        }
        if( localSettings.state !== settings.state){
          switch (settings.state) {
            case 'play':
              player.playVideo();
              break;
            case 'pause':
              player.pauseVideo();
              break;
            case 'finish':
                // console.log('status finsi');
                // onYouTubeIframeAPIReady();
                // Meteor.call('nextVideo');
                break;
            case 'wait':

              break;

          }
        }


      }else{
        console.log('pas de player');



          if(rdy){
          console.log('sans onYouTubeIframeAPIReady');
          player = new YT.Player('player', {
                 videoId: settings.url,
                 playerVars: {'controls': 0 },
                 events: {
                   'onStateChange': onStateChange,
                   'onReady' : onPlayerReady,
                 }
               });
              if(!time_update){
                time_update = Meteor.setInterval(updateBar, 1000);
              }
        }else {

          onYouTubeIframeAPIReady = function(){
            console.log('onYouTubeIframeAPIReady');
            if(!player){
              player = new YT.Player('player', {
                     videoId: localSettings.url,
                     playerVars: {'controls': 0 },
                     events: {
                       'onStateChange': onStateChange,
                       'onReady' : onPlayerReady,
                     }
                   });
            }

              rdy=true;
            };


            try {
                  console.log('on essaye');
                  if (YT && !player){
                    console.log('paseer aessaye');
                    console.log(settings);
                    player = new YT.Player('player', {
                           videoId: settings.url,
                           playerVars: {'controls': 0 },
                           events: {
                             'onStateChange': onStateChange,
                             'onReady' : onPlayerReady,
                           }
                         });
                         console.log(player);
                    rdy=true;
                  }
              }
              catch(err) {
                  console.log(err);
              }
              time_update = Meteor.setInterval(updateBar, 1000);

        }

  }
}


onPlayerReady = function(e) {
  e.target.playVideo();
  e.target.setVolume(50);
  setUpSettings(e);


};

onStateChange = function (event) {
  switch (event.data) {
    case YT.PlayerState.ENDED:
      console.log('ENDED');
        Meteor.call('finishVideo');

      break;
    case YT.PlayerState.PAUSED:
      console.log('PAUSED');

      if(localSettings.state === 'play'){
        player.playVideo();
      }
      break;
     case YT.PlayerState.PLAYING:
      console.log('PLAYIN');

      if(localSettings.state === 'pause'){
        player.pauseVideo();
      }
      break;

  }
};

setUpSettings = function(e){
      if(localSettings){
        if(localSettings.state == 'play'){
          jumpToCurrentTime(e);
        }
        else if(localSettings.state == 'pause'){
          e.target.seekTo(localSettings.videoTime);
          e.target.pauseVideo();
        }else if(localSettings.state == 'stop'){

        }
      }


  //     time_update = Meteor.setInterval(updateBar, 1000);

        return true;
};

function updateBar(){
  if (player) {
    $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
  }else{
    console.log('no player');
  }
}


function changeState(state){
  switch(state) {
      case 'play':
          player.playVideo();
          break;
      case 'pause':

          player.pauseVideo();
          break;

      case 'stop':

          player.stopVideo();
          break;
  }
  return true;
}



function jumpToCurrentTime(e){
 return  Meteor.call('getCurrentTime',function(error,result){
   if (error) {
     return error;
   }
   else{
     console.log(result);
     return e.target.seekTo(result);
   }
 });
}
