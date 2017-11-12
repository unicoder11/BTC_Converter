var login = require('./login'),
	signup = require('./signup')
	User = require('../models/user');

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });
    });

    // strategies
    login(passport);
    signup(passport);

}