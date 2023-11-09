const User = require('../models/UserModel');

const createUser = async (req, res) => {
    try {
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
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createUser };
