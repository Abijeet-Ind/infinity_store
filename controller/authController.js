const user = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const crypto = require('crypto');
const { promisify } = require('util');

const cookiesCreator = (user, res, statusCode) => {
    const token = TokenCreator(user.id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    // if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        message: 'user created successfully'
    })
}

const TokenCreator = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRETCODE, {
        expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
    })
}

exports.getAllProductData = catchAsync(async (req, res, next) => {
    const tour = await user.find();
    res.status(200).json({
        status: 'success',
        message: 'getAllProductData'
    })
})

exports.signup = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const userData = await user.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    })
    cookiesCreator(userData, res, 200);
})

exports.login = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const { email, password } = req.body;
    if (!email || !password) {
        return next(AppError('PLEASE ENTER EMAIL OR PASSWORD', 400));
    }
    const findUser = await user.findOne({
        email
    }).select('+password');
    if (!findUser) {
        return next(new AppError('CANNOT FIND THE USER! PLEASE TRY AGAIN', 400))
    }
    if (!findUser || !(await findUser.correctPassword(password, findUser.password))) {
        return next(new AppError('PASSWORD DIDN\'T MATCHED', 400));
    }

    cookiesCreator(findUser, res, 200);
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    if (!email) {
        return next(AppError('PLEASE ENTER AN EMAIL', 400));
    }
    const findUser = await user.findOne({
        email
    });
    const resetToken = await findUser.createPasswordRestToken();
    await findUser.save({
        validateBeforeSave: false
    });

    const url = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    res.status(200).json({
        status: 'success',
        url
    })
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const resetToken = req.params.token;
    const comparerToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const findUser = await user.findOne({
        passwordResetToken: comparerToken,
        passwordResetExpiresAt: {
            $gt: Date.now()
        }
    }) // COMPARE TOKEN AND CURRENT DATE WITH THE EXPIRE DATE

    if (!findUser) {
        return next(new AppError('LINK EXPIRED PLEASE!! TRY AGAIN!', 400))
    }
    
    findUser.password = req.body.password;
    findUser.passwordConfirm = req.body.passwordConfirm;
    findUser.passwordResetToken = undefined;
    findUser.passwordResetExpiresAt = undefined;
    findUser.save(); // IF WE USE MODEL.SAVE THEN CHANGES LIKE ENCRYPTION WILL BE APPLIED

    res.status(200).json({
        status: 'success',
        message: 'PASSWORD UPDATED SUCCESSFULLY'
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    console.log(req.cookies.jwt)
    if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new AppError('PLEASE LOGIN FIRST ', 400));
    }
    const decodedUser = await promisify(jwt.verify)(token, process.env.JWT_SECRETCODE);
    const findUser = await user.findById(decodedUser.id);
    if (!findUser) {
        return next(new AppError('CANNOT FIND THE USER WITH THAT ID', 400));
    }

    if (await findUser.passwordChangedAfter(decodedUser.iat)) {
        return next(new AppError('USER RECENTLY CHANGED THE PASSWORD! PLEASE LOGIN', 400));
    }

    req.user = findUser;
    next();
})

// SUBTRACT THE JWTIAT WITH DATE.NOW() - 1000

exports.isAllowed = (...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)){
            return next( new AppError('YOU DONT HAVE PERMISSION', 400));
        }
    }
    next();
}

exports.updateUserPassword = catchAsync( async(req, res, next) => {
    const findUser = await user.findById(req.user.id).select('+password');      
    if(!(await findUser.correctPassword(req.body.currentPassword, findUser.password))){
        return next(new AppError('WRONG PASSWORD', 400));
    }
    if(!(req.body.newPassword === req.body.confirmPassword)){
        return next(new AppError('NEW PASSWORD AND CONFIRM PASSWORD DOESNOT MATCH ', 400));
    } else {
        findUser.password = req.body.newPassword;
        findUser.passwordConfirm = req.body.passwordConfirm;
        findUser.save();
    }

    res.status(200).json({
        status: 'success',
        message: 'PASSWORD UPDATED SUCCESSFULLY'
    })

})