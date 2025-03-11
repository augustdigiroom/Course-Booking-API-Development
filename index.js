const express = require("express");
const mongoose = require("mongoose");
// Allows our backend application to be available in our frontend application
// Allows us to control the app's Cross Origin Resource Sharing settings
const cors = require("cors");
// Google Login
const passport = require('passport');
const session = require('express-session');
require('./passport');

//[SECTION] Routes
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require("./routes/enrollment");

// [SECTION] Environment Setup
require('dotenv').config();

const app = express();

// const port = 4000;

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGODB_STRING);

// If the connection is successful, output in the console
mongoose.connection.once("open", () => console.log("We're connected to the cloud database"));

// Setup for allowing the server to handle data from requests
// Allows your app to read json data
app.use(express.json());
// Allows your app to read data from forms
app.use(express.urlencoded({extended:true}));

// You can also customize the CORS options to meet your specific requirements
const corsOptions = {
	// Allow request from this origin (the client's URL) the origin is in array form if there are multiple origins
	origin: ['http://localhost:8000'],
	// Allow only specified HTTP methods, optional only if you want to restrict the methods
	// methods: ['GET', 'POST'],

	// Allow only specified headers, optional only if you want to restrict headers
	// allowedHeaders: ['Content-Type', 'Authorization'],

	// Allows crendentials (e.g. cookies, authorization headers)
	credentials: true,

	// Provides status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204.
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

// [SECTION] Google Login
// Creates a session with the given data
// resave prevents the session from overwriting the secret while the session is active
// saveUninitialized prevents the data from storing data in the session while the data has not yet been initialized
app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}));
// Initializes the passport package when the application runs
app.use(passport.initialize());
// Creates a session using the passport package
app.use(passport.session());

//[SECTION] Backend Routes 
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);


if(require.main === module){
	app.listen(process.env.PORT || 3000, () => console.log(`Server running at port ${process.env.PORT || 3000}`));
}

module.exports = {app,mongoose};