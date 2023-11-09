// models/UserModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create a schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

const User = mongoose.model('User', userSchema);

module.exports = User;