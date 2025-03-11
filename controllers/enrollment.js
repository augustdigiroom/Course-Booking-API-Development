const Enrollment = require("../models/Enrollment");
const { errorHandler } = require("../auth");

// [SECTION] Enroll a user to a course
/*
	Steps:
	1. Check if the user is an admin, if it is return forbidden action.
	2. Else if the user is not an admin, save the enrollment document.
*/

module.exports.enroll = (req, res) => {
	
	console.log(req.user.id);
	console.log(req.body.enrolledCourses);
	
	if(req.user.isAdmin){
		return res.status(403).send(false);
	}
	
	let newEnrollment = new Enrollment({

		userId: req.user.id,
		enrolledCourses: req.body.enrolledCourses,
		totalPrice: req.body.totalPrice
	})
	
	return newEnrollment.save()
	.then(enrolled => {
		return res.status(201).send(true);
	})
	.catch(error => errorHandler(error, req, res));

}