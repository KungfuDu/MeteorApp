
Contenders = new Mongo.Collection("contenders");

Meteor.methods({
  insertContender: function(contender){
    Contenders.insert({name : contender.name , score : 0 });

  },
  incrementScore: function(contender){
    Contenders.update({_id : contender._id},{$inc:{score:1}});
  }

})
