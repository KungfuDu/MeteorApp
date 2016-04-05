chatStream = new Meteor.Stream('chat');

chatStream.permissions.write(function() {
  return true;
});

chatStream.permissions.read(function() {
  return true;
});

Meteor.publish('allUsers', function() {
    return  Meteor.users.find({},{fields: {'username': 1}});
});
