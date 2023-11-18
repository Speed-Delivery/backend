const User = require("../models/UserModel");

//const users = User.find({});
//console.log(users, "this is users");

const getAllUsers = async () => {
  try {
    const users = await User.find({}).exec();
    return users;
  } catch (error) {
    throw error;
  }
};

// This function should be inside an asynchronous context
const fetchDataAndLog = async () => {
  try {
    const users = await getAllUsers();
    //console.log(users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Call the asynchronous function
fetchDataAndLog();

const validateUsers = async (req, res) => {
  const { senderName, senderPhoneNumber, recipientName, recipientPhoneNumber } =
    req.body;
  //console.log(req.body, "this is from backend");

  try {
    // Validate sender
    //console.log(User, "try block");
    const sender = await User.findOne({
      username: senderName,
      phone: senderPhoneNumber,
      //phone: parseInt(senderPhoneNumber, 10),
    });
    console.log(sender, "this is sender");

    if (!sender) {
      return res.status(400).json({ error: "Sender validation failed" });
    }

    // Validate receiver
    const receiver = await User.findOne({
      username: recipientName,
      phone: recipientPhoneNumber,
    });
    console.log(receiver, "this is reciever");

    if (!receiver) {
      return res.status(400).json({ error: "Receiver validation failed" });
    }

    // Return the ObjectIds
    console.log("reached res json");

    res.json({ senderId: sender._id, receiverId: receiver._id });
  } catch (error) {
    console.error("Error during user validation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { validateUsers };
