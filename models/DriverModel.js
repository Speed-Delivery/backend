const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create a schema
const driverSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true, // Ensure uniqueness
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'] // Only alphanumeric characters
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Invalid email format'
        ]
      },      
    password: {
        type: String,
        required: [true, 'Password is required']
    },               
   registeredAt: { 
    type: Date, 
    default: Date.now },          
});

driverSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

driverSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


const Driver = mongoose.model('Driver', driverSchema, 'newdrivers');

module.exports = Driver;
