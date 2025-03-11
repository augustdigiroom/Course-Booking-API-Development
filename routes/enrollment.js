const express = require('express');
const enrollmentController = require('../controllers/enrollment');
const { verify } = require("../auth");

const router = express.Router();

// [SECTION] Route to enroll user to a course
router.post('/enroll', verify, enrollmentController.enroll);

module.exports = router;