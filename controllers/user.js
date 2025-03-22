//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment')
const auth = require('../auth');

const { errorHandler } = auth;

//[SECTION] Check if the email already exists

module.exports.checkEmailExists = (req, res) => {
    // Check if the email from the request body contains an "@" symbol.
    if(req.body.email.includes("@")){
        return User.find({ email : req.body.email })
        .then(result => {
            // Mini-Activity: add status code
            if (result.length > 0) {
                return res.status(409).send({ message: "Duplicate email found" });
            } else {
                return res.status(404).send({ message: "No duplicate email found" });
            };
        })
        .catch(error => errorHandler(error, req, res))
    }else{
        // If the email from the request body does not contain an "@", send a 400 (Bad Request) status with "false" to indicate valid input
        res.status(400).send({ message: "Invalid email format" });
    }
};


//[SECTION] User registration
module.exports.registerUser = (req, res) => {

    // Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        // if the email is not in the right format, send a message 'Invalid email format'.
        return res.status(400).send({ message: 'Invalid email format' });
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11){
        // if the mobile number is not in the correct number of characters, send a message 'Mobile number is invalid'.
        return res.status(400).send({ message: 'Mobile number is invalid' });
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        // If the password is not atleast 8 characters, send a message 'Password must be atleast 8 characters long'.
        return res.status(400).send({ message: 'Password must be atleast 8 characters long' });
    // If all needed requirements are achieved
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        // if all needed requirements are achieved, send a success message 'User registered successfully' and return the newly created user.
        .then((result) => res.status(201).send({
            message: 'User registered successfully',
            user: result
        }))
        .catch(error => errorHandler(error, req, res));
    }
};

//[SECTION] User authentication
module.exports.loginUser = (req, res) => {
    if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                return res.send(false);
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.send({ access : auth.createAccessToken(result)});
                } else {
                    return res.send(false);
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    }else{
        return res.status(400).send(false);
    }
};


//[Section] Activity: Retrieve user details
/*
    Steps:
    1. Retrieve the user document using it's id
    2. Change the password to an empty string to hide the password
    3. Return the updated user record
*/
module.exports.getProfile = (req, res) => {

    return User.findById(req.user.id)
    .then(user => {
        user.password = "";
        res.send(user)
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.getEnrollments = (req, res) => {
    return Enrollment.find({userId : req.user.id})
    .then(enrollments => {
        if (enrollments.length > 0) {
            return res.status(200).send(enrollments);
        }
        return res.status(404).send(false);
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.resetPassword = async (req, res) => {
    try {
        // Extract JWT token from authorization header
        // const token = req.headers.authorization?.split(' ')[1];
        // if (!token) {
        //     return res.status(401).json({ message: 'Unauthorized: No token provided' });
        // }

        // Verify token
        // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // const userId = decoded.id;

        // Extract new password from request body
        const { newPassword } = req.body;
        const {id} = req.user

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password in the database
        // req.user <- decoded token

        await User.findByIdAndUpdate(id, { password: hashedPassword });

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


//[SECTION] Update profile
// Update the function to arrow to unify our code formats
// Modify how we export our controllers
module.exports.updateProfile = async (req, res) => {
    try {

        // Add a console.log() to check if you can pass data properly from postman
        // console.log(req.body);

        // Add a console.log() to show req.user, our decoded token, does have id property
        // console.log(req.user);
            
        // Get the user ID from the authenticated token
        const userId = req.user.id;

        // Retrieve the updated profile information from the request body
        // Update the req.body to use mobileNo instead of mobileNumber to match our schema
        const { firstName, lastName, mobileNo } = req.body;

        // Update the user's profile in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, mobileNo },
            { new: true }
        );

        res.send(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to update profile' });
    }
}

/*//[SECTION] Make User an Admin (Only for Admin users)
module.exports.makeUserAdmin = (req, res) => {
    // Check if the user has an admin token
    const isAdmin = req.user && req.user.role === 'admin';  // Assuming req.user contains the authenticated user's data and role
    if (!isAdmin) {
        return res.status(403).send({ message: "Unauthorized: Admins only" });
    }

    // Check if the user ID is provided in the request body
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).send({ message: "User ID is required" });
    }

    // Find the user by ID and update their role to "admin"
    return User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            // Update user role to admin
            user.role = 'admin';  // Assuming you have a 'role' field in the User schema
            return user.save();
        })
        .then(() => {
            return res.status(200).send({ message: "User updated to admin successfully" });
        })
        .catch(error => errorHandler(error, req, res));
};
*/

module.exports.makeUserAdmin = (req, res) => {

    // Check if the user ID is provided in the request body
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).send({ message: "User ID is required" });
    }

    // Find the user by ID and update their isAdmin flag to true
    return User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            // Update user isAdmin to true
            user.isAdmin = true;  // Assuming you want to update isAdmin instead of role
            return user.save();
        })
        .then(() => {
            return res.status(200).send({ message: "User updated to admin successfully" });
        })
        .catch(error => errorHandler(error, req, res));
};
