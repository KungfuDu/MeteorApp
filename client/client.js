

//-------------------------


Template.mainLayout.helpers({
  "hideChat":function(){
    return Session.get('hideChat');
  }
});
Template.mainLayout.events({
  "click #chatArrowLefts":function(){
     Session.set('hideChat', false);
  },
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    }
});


// VIDEO SEARCH BOX ---------------------------


// Contenders -----------------------------------------------

Template.newContenderForm.events({
    submit : function(event){
      event.preventDefault();
      console.log("sweg");
      //ajoute un nouveau contender a partir de
      Meteor.call('insertContender',{name : $('#contenderInput').val()});
      $('#contenderInput').val("");

    }
});



Template.contenders.events({
    click : function(event){
      event.preventDefault();
      console.log($(this));
      Meteor.call('incrementScore',{_id : $(this)[0]._id});
    }
});

Template.contenders.helpers({
  contenders : function(){
    return Contenders.find({},{sort:{score:-1}});
  }
})
