// controllers/userController.js
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hashing password
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ user: { username: user.username, _id: user._id } }); 
    } catch (error) {
        if (error.code === 11000) {
            // Handling duplicate username error
            return res.status(409).json({ error: "Username already exists" });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser
};