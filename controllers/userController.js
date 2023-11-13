const { compareSync } = require('bcrypt');
const User = require('../models/UserModel');
const generateToken = require('../config/generateToken');

const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const { username, password, email, role, fullName, phone, address } = req.body;

        // Check for existing username
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(409).json({ error: "Username already exists" });
        }

        // Check for existing email if provided
        if (email) {
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail) {
                return res.status(409).json({ error: "Email already exists" });
            }
        }

        // Create and save the new user
        const user = new User({ username, password, email, role, fullName, phone, address });
        await user.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const signInUser = async (req, res) => {
    const { username, password, role } = req.body;

    //Check username exist or not
    const user = await User.findOne({ username });
  
    if (!user) {
      return res.status(404).json({ error: "Access denied for this role" });
    }
    
      // Check if the role matches
    if (user.role !== role) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    //Matching Password
    const passwordMatch = await user.comparePassword(password);
  
    if (passwordMatch) {
      res
        .status(200)
        .json({
          message: "Login successful",
          token: generateToken(user._id),   // generate jwt access token
          role: user.role,
        });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  };

module.exports = { createUser, signInUser };
