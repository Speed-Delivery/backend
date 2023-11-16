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
    console.log(req.body);
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
    console.log(passwordMatch);
    if (passwordMatch) {
      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          phone: user.phone,
          address: user.address,
          token: generateToken(user._id), // generate jwt access token
        },
      })
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  };

  //get user profile
  const getUserProfile = async (req, res) => {
    const { userId } = req.body;
    try {   //select every field without password
      const user = await User.findById(userId).select("-password");
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  //update user profile

  const updateUserProfile = async (req, res) => {

    //recieve user object from the request body

    const user = await User.findById(req.user._id);

    if (user) {

      //updating user data if it's in the request body, otherwise, keep the old data

      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.fullName = req.body.fullName || user.fullName;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      if (req.body.password) {
        user.password = req.body.password;
      }

      //saving updated user data into the database

      const updatedUser = await user.save();

      //sending new user data back to the client

      res
        .json({
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          fullName: updatedUser.fullName,
          phone: updatedUser.phone,
          address: updatedUser.address,
          token: generateToken(updatedUser._id),
        })
        .status(200);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  };
module.exports = { createUser, signInUser, getUserProfile, updateUserProfile };
