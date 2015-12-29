Router.configure({
    layoutTemplate: 'base'
});

Router.route('/', {
    name: 'modalLogin'
});

Router.route('/home', function(){
    if(Meteor.user()){
      this.layout('mainLayout');
    }
    else {
      this.layout('errorLayout');
    }

});
