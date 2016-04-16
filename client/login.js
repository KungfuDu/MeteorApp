// Login Modal --------------------------------------------------

Template.modalLogin.helpers({
    'showModal': function() {

        return Session.get('showModal');
    }

});

Template.modalLogin.events({
    'click #createAccountLink': function() {
        Session.set('showModal', true);
    },
    'click #loginLink': function() {
        Session.set('showModal', false);
    },
    submit: function(event) {
        event.preventDefault();
        user = $('#username').val();
        console.log(event);

    },
    'click button': function() {
        console.log('pute');
        $('#modalLogin').hide();
        Router.go('/home');

    },
    'focus .field-input': function(e){
      console.log(222);
      $(e.target).parent().addClass('is-focused has-label');
    },
    'blur .field-input': function(e){

      $parent =  $(e.target).parent();
      $parent.removeClass('is-focused');
      if($(e.target).val()===""){
        $parent.removeClass('has-label');
      }
    }
});



Template.login.events({
    "submit form": function(event) {
        event.preventDefault();
        var user = $("input[name='username']").val();
        var password = $("input[name='password']").val();

        // Login en utilisant le nom d'utilisateur ou l'email
        Meteor.loginWithPassword(
            user,
            password,
            function(err) {
                if (err) {
                    alert(err.reason);
                } else {
                    Router.go('/home');

                }
            }
        );

    }
});



Template.register.events({
    "submit form": function(event, template) {
        event.preventDefault();
        var username = $('input[name="username"]').val();
        var email = $('input[name="email"]').val();
        var password = $('input[name="password"]').val();
        var user = {
            username: username,
            email: email,
            password: password,
            profile: {}
        };
        Accounts.createUser(user, function(err) {
            if (err) {
                alert(err.reason);
            } else {
                Meteor.loginWithPassword(
                    user,
                    password,
                    function(err) {
                        if (err) {
                            console.log(err.reason);
                        } else {
                            Router.go('/home');
                        }
                    }
                );
            }
        });
    }
});
