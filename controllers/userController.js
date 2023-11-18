const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const generateToken = require('../config/generateToken');

exports.createUser = async (req, res) => {
    try {
        const { username, password, email, role, fullName, phone, address } = req.body;

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(409).json({ error: "Username already exists" });
        }

        if (email) {
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail) {
                return res.status(409).json({ error: "Email already exists" });
            }
        }

        const user = new User({ username, password, email, role, fullName, phone, address });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.signInUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            phone: user.phone,
            address: user.address,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser= async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.fullName = req.body.fullName || user.fullName;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            fullName: updatedUser.fullName,
            phone: updatedUser.phone,
            address: updatedUser.address,
            token: generateToken(updatedUser._id, updatedUser.role),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

