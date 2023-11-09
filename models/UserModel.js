const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create a schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true, // Ensure uniqueness
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'] // Only alphanumeric characters
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Username already exists'));
    } else {
        next(error);
    }
});

const User = mongoose.model('User', userSchema, 'usersCollection');

module.exports = User;
