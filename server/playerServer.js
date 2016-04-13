
Meteor.publish('PlayerSettings', function() {
    return  Settings.find({param : 'default'});
});
