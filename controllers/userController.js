// controllers/userController.js
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser
};