const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');

const userModel = new mongoose.Schema({
    email: {
        type: String,
        require: [true, 'please enter an email']
    },
    name: {
        type: String,
        require: [true, 'please enter an email']
    },
    password: {
        type: String,
        require: [true, 'please enter an email'],
        maxlength: 20,
        minlength: 6,
        select: false // SELECT WILL HIDE THE PASSWORD WHIEN QUERRIED 
    },
    passwordConfirm: {
        type: String,
        require: [true, 'please enter an email'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "PASSWORD DOESNOT MATCHED"
        }
    },
    role: {
        type: String,
        enum: ['buyer', 'seller']
    },
    createdDate: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresAt: Date
})

userModel.pre('save', function(next) {
    if(!(this.isModified('password')) || this.isNew) return next();
    console.log(this.isModified('password'))
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userModel.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
})

userModel.methods.correctPassword = async function (candidatePassword, userPassword) {
    console.log(candidatePassword, userPassword)
    return await bcrypt.compare(candidatePassword, userPassword);
};

userModel.methods.createPasswordRestToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000; 

    return resetToken;
}

userModel.methods.passwordChangedAfter = function(iatDate){
    if(this.passwordChangedAt){
        const compareTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(compareTime);
        return iatDate > compareTime;
    }
    return false
}

const user = mongoose.model('user', userModel);
module.exports = user;