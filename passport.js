// require('dotenv').config();
// // Passport is an authentication middleware for Node.js. It can be added in any Express-based web application. A comprehensive set of strategies that support authentication using username and password, Facebook, Twitter, Google and more.
// const passport = require("passport");
// // Strategies are algorithms that are used for specific purposes. In this case authenticating the application using the Google API Console project OAuth Cleint ID Credentials.
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// // This configures passport to use the Google OAuth 2.0 authentication strategy.
// // Uses the Google API Console project OAuth Client ID Credentials (e.g. clientID and clientSecret) to authorize the app to connect to the google API
// // "callbackURL" is the defined route on how the request will be handled later once a Google Login has been implemented.
// passport.use(new GoogleStrategy({
// 	clientID: process.env.clientID,
// 	clientSecret: process.env.clientSecret,
// 	callbackURL: "http://localhost:4000/users/google/callback",
// 	passReqToCallback: true
// },
// // This is the callback function that gets executed when a user is successfully authenticated
// // returns the "profile" of the email used in the Google Login containing user information (email, firstName or lastName)
// function(request, accessToken, refreshToken, profile, done){
// 	// "done" is a parameter used in the function that functions as a callback.
// 	// "done" is considered as a naming convention for callbacks.
// 	// Callbacks are executed only when called inside the function they are defined in.
// 	return done(null, profile)
// }
// ))

// // This function is used to serialize our user object into a session.
// // In this case, the entire user object is serialized.
// // The serialized user object is then stored in the session.
// passport.serializeUser(function(user, done){
// 	done(null, user);
// })

// // This function is used to deserialize the user object from the session.
// // It retrieves the serialized user object from the session and passes it to the "done" callback
// passport.deserializeUser(function(user, done){
// 	done(null, user);
// })