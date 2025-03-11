const jwt = require('jsonwebtoken');
// [SECTION] Environment Setup
require('dotenv').config();

// [SECTION] JSON Web Tokens
/*
	- JSON Web Token or JWT is a way of securely passing information from server to the client or to other parts of a server
	- Information is kept secure through the use of the secret code
	- Only the system that knows the secret code that can decode the encrypted information
	- Imagine JWT as a gift wrapping service that secures the gift with a lock
	- Only the person who knows the secret code can open the lock
	- And if the wrapper has been tampered with, JWT also recognizes this and disregards the gift
	- This ensures that the data is secure from the sender to the receiver
*/

// [SECTION] Token Creation
/*
Analogy
	- Pack the gift and provide a lock with the secret code as the key
*/
module.exports.createAccessToken = (user) => {
	// The data will be received from the registration form
	// When the user logs in, a token will be created with user's information
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	// Generates JSON web token using the jwt's sign method
	// Generates the token using the form data and the secret code with no additional options provided
	// SECRET_KEY is a User defined string data that will used to create our JSON Web Tokens
	// Used in the algorithm for encrypting our data which makes it difficult to decode the information without the defined secret keyword
	// Since this is a critical data, we will use the .env to secure the secret key. "Keeping your secrets secret"
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {})

}

// [SECTION] Token Verification
/*
Analogy
	Receive the gift and open the lock to verify if the sender is legitimate and the gift was not tampered with
	- Verify will be used as a middleware in ExpressJS. Functions added as argument in an expressJS route are considered as middleware and is able to receive the request and response objects. Middlewares will be further elaborated on later sessions.
*/
module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if(typeof token === "undefined"){
		return res.send({ auth: "Failed. No Token" })
	}else{
		console.log(token);
		token = token.slice(7, token.length);
		console.log(token);

		// [SECTION] Token Decryption
		/*
		Analogy
			Open the gift and get the content
		- Validate the token using the "verify" method decrypting the token using the secret code
		- token - the jwt token passed from the request headers
		- JWT_SECRET_KEY - the secret word from earlier which validates our token.
		- function(err, decodedToken) - err contains error in verification, decodedToken contains the decoded data within the token after verification
		*/
		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){
			if(err){

				return res.status(403).send({
					auth: "Failed",
					message: err.message
				});
			
			}else{

				console.log("result from verifiy method:")
				console.log(decodedToken);

				req.user = decodedToken;

				// next() is an expressJS function which allows us to move to the next function in the route. It also passes details of the request and response to next function/middleware
				next();
			}
		})
	}
}

// [SECTION] Verify Admin
// The "verifyAdmin" method will only be used to check if the user is an admin or not.
// The "verify" method should be used before "verifyAdmin" because it is used to check the validity of the jwt. Only when the token has been validated should we check if the user is an admin or not.
// The "verify" method is also the one responsible for updating the "req" object to include the "user" details/decoded token in the request body.
// Being an ExpressJS middleware, it should also be able to receive the next() method
module.exports.verifyAdmin = (req, res, next) => {

	// console.log('result from verifyAdmin method');
	// console.log(req.user);
	if(req.user.isAdmin){
		next();
	}else{
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}

}


module.exports.errorHandler = (err, req, res, next) => {
	// Logs the error
	console.error(err);

	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error'; 
	res.status(statusCode).json({
		
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}

	})

}

// [SECTION] Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
	if(req.user){
		next();
	}else{
		res.sendStatus(401);
	}
}