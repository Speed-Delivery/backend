const bcrypt = require('bcrypt');
const Driver = require('../models/DriverModel');
const generateToken = require('../config/generateToken');

exports.createDriver = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const existingUserByUsername = await Driver.findOne({ username });
        if (existingUserByUsername) {
            return res.status(409).json({ error: "Username already exists" });
        }    
        if (email) {
            const existingUserByEmail = await Driver.findOne({ email });
            if (existingUserByEmail) {
                return res.status(409).json({ error: "Email already exists" });
            }
        }
        
        const driver = new Driver({ username, password, email });
        await driver.save();
 
        res.status(201).json({ message: "Driver account created successfully", user: {
            _id: driver._id,
            username: driver.username,
            email: driver.email,
            token: generateToken(driver._id),
        } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.signInDriver = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Driver.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDriver = async (req, res) => {
    try {
        const user = await Driver.findById(req.params.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateDriver = async (req, res) => {
    try {
        const user = await Driver.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: "Driver id not found" });
        }
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDriver = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("The user ID to be deleted is: ", userId);
        // Delete the user
        await Driver.findByIdAndDelete(userId);
  
        res.status(200).json({ message: 'Driver account deleted successfully' });
        } catch (error) {
        res.status(500).json({ error: 'Failed to delete driver account' });
    }
  };
  
exports.getAllDrivers = async (req, res) => {
    try {
        const users = await Driver.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};