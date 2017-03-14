var User = require('../app/models/user');
var Question = require('../app/models/question');

module.exports = function(app, passport) {

    app.get('/questions', function(req, res) {

      console.log('getting all questions');

      Question.find({}, function(err, questions) {

        if (err)
          return res.send(err);

        return res.send(questions);
  		});
    });

    app.post('/questions', function(req, res) {

      console.log('create a question');

      var question = new Question();

      question.questionText = req.body.questionText;
      question.answers = req.body.answers;

      question.save(function(err) {

        if(err)
          res.send(err);

                console.log('no err');
          res.json({ message: 'Question created!' });
      });
    });

    app.post('/users', function(req, res) {

      console.log('create a user', req.body);

      // look for user in db
      User.findOne({ 'facebook.id' :  req.body.id }, function(err, user) {
          // if there are any errors, return the error
          if (err)
              return done(err);

          console.log('local-signup !req.user no err');
          // check to see if theres already a user with that email
          if (user) {
              console.log('found user');
              return res.send({ 'user': user, 'new': false });
          } else {

                console.log('create user');
              // create the user
              var newUser = new User();

              newUser.facebook = req.body.facebook;

              newUser.save(function(err) {
                  if (err)
                      res.json({ message: 'error!' });

                return res.send({ 'user': newUser, 'new': true });
              });
          }

      });

    });

    app.get('/users/:id', function(req, res) {

      console.log('getting a user by id');

      User.findById(req.params.id, function(err, user) {

        if (err)
          return res.send(err);

        return res.send(user);
  		});
    });

    app.post('/users/:id', function(req, res) {

      User.findById(req.params.id, function(err, user) {

        console.log('posting a user by id');

        if (err)
          return res.send({ message: 'error with request' });

        user.points = req.body.user.points || 0;
        user.name = req.body.user.name || '';
        user.studyProgram = req.body.user.studyProgram || '';
        user.country = req.body.user.country || '';
        user.quote = req.body.user.quote || '';
        user.languages = req.body.user.languages || [];
        user.interests = req.body.user.interests || [];
        user.questions = req.body.user.questions || [];
console.log(user);

  			user.save(function(err) {

  				if (err) {
            console.log('err', err);
            return res.send({ message: 'error updating user' });
          }

            console.log('NO err');

  				return res.send({ message: 'user updated!' });
  			});
  		});
      }
    );


    // process the login form
    app.post('/signin',
      passport.authenticate('local-login', {}),
      function(req,res){
        console.log('In login');
        res.send(req.session);
      }
    );

    // process the signup form
    app.post('/signup',
      passport.authenticate('local-signup', {}),
      function(req,res){
        console.log('In signup');
        res.send(req.session);
      }
    );

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {}),
            function(req,res){
              console.log('In signup',req.session.passport.user);
            });


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================


        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));




};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
