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
    },
    email: { 
        type: String, 
        unique: true ,
        sparse: true
    },     
    role: { 
        type: String, 
        enum: ["consumer", "driver", "admin"] 
    },
    fullName: { 
        type: String 
    },                               
   phone: { 
    type: Number 
    },                                  
   address: { 
    type: String 
    },                                
   registeredAt: { 
    type: Date, 
    default: Date.now },          
});

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


const User = mongoose.model('User', userSchema, 'usersCollection');

module.exports = User;
