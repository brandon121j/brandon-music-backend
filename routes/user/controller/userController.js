const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

const errorHandler = require('../../util/errorHandler');

async function createUser(req, res) {
    const { firstName, lastName, email, password } = req.body;
	try {
		let salt = await bcrypt.genSalt(12);

		let hashedPassword = await bcrypt.hash(password, salt);

		const createdUser = new User({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: hashedPassword,
		});

		let savedUser = await createdUser.save();

		res.json({
			message: 'success! user created please login',
			savedUser: savedUser,
		});
	} catch (err) {
		res.status(500).json({
            message : "failed",
            error : errorHandler(err)
        })
	}
}

async function login(req, res) {
    const {email, password } = req.body

    try{
        let foundUser = await User.findOne({ email: email })

        if(!foundUser){
            res.status(500).json({
                message : "error",
                error: "User not found. Please sign up!"
            })

        }else{

            let comparedPassword = await bcrypt.compare(password, foundUser.password)

            if(!comparedPassword){
                res.status(500).json({
                    message : 'error',
                    error: "Incorrect login information. Please try again"
                })
            }else{
                let jwtToken = jwt.sign (
                    {
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        email : foundUser.email,
                        id : foundUser._id,
                    },
                    process.env.JWT_SECRET,
                    {expiresIn : "24h"}
                )

                res.json({
                    message : 'successfully logged in',
                    token : jwtToken
                })
            }
        }
    }catch(err){
        res.status(500).json({
            message: 'error',
            error : errorHandler(err)})
    }
}

const getUserInfo = async (req, res) => {
    try {
        const decodedData = res.locals.decodedData;
        const foundUser = await User.findOne({ email: decodedData.email })
            .populate('post');

        res.json({ message: "SUCCESS", payload: foundUser})
    } catch(err) {
        res.status(404).json({ message: "User not found", error: err.message })
    }
}

module.exports = {
	createUser,
	login,
	getUserInfo
};
