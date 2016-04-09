chatStream = new Meteor.Stream('chat');
chatCollection = new Meteor.Collection(null);
Meteor.subscribe("allUsers");

chatStream.on('chat', function(res) {


  console.log($(this)[0].userId);
  var user = Meteor.users.findOne({_id:$(this)[0].userId});

  chatCollection.insert({
    username: user.username,
    message: res.message
  });
  $('#messages').animate({ scrollTop: $('#messages')[0].scrollHeight }, "slow");

});

Template.chat.helpers({
  "messages": function() {
    return chatCollection.find();
  }

});


Template.chat.events({
  'click #chatArrowRight':function(){
    Session.set('hideChat', true);
    console.log(Session.get('hideChat'));
  }
});


Template.chatForm.events({
  submit: function(event) {
    event.preventDefault();
    var message = $('#chatForm input').val();
    chatCollection.insert({
      username: 'me',
      message: message
    });
    console.log(Meteor.user());
    chatStream.emit('chat', {message: message , username:Meteor.user() });
     $('#chatForm input').val('');
     $('#messages').animate({ scrollTop: $('#messages')[0].scrollHeight }, "slow");
  }
});
