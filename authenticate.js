var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
const jwt = require('jsonwebtoken');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var config = require('./config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey);
};

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey,
};

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err){
                return done(err, false);
            }
            else if (user){
                return done(null, user);
            }
            else{
                return done(null, false);
            }
        });
    }
));

exports.verifyUser = passport.authenticate('jwt', {session: false}); // this will run passport.use(new JwtStrategy...)
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin){
        return next();
    }
    else {
        var err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
};