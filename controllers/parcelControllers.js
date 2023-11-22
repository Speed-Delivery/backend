const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Parcel = require("../models/ParcelModel");
const User = require("../models/UserModel");
const Locker = require("../models/LockerModel");

// this is for the parcel

const getParcels = async (req, res, next) => {
  let parcels;
  try {
    parcels = await Parcel.find({});
  } catch (err) {
    const error = new Error("Fetching parcels failed, please try again later.");
    error.code = 500;
    return next(error);
  }
  res.json({
    parcels: parcels.map((parcel) => parcel.toObject({ getters: true })),
  });
};

const getParcelsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);

  let userWithParcels;
  try {
    userWithParcels = await User.findById(userId).populate("sentParcels");
  } catch (err) {
    const error = new Error(
      "Fetching user data failed, please try again later."
    );
    error.code = 500;
    return next(error);
  }

  // Check if user exists
  if (!userWithParcels) {
    const error = new Error("Could not find user for the provided id.");
    error.code = 404;
    return next(error);
  }

  // Check if user has sent parcels
  if (userWithParcels.sentParcels.length === 0) {
    const error = new Error("User has not sent any parcels.");
    error.code = 404;
    return next(error);
  }

  res.json({
    parcels: userWithParcels.sentParcels.map((parcel) =>
      parcel.toObject({ getters: true })
    ),
  });
};

const getParcelById = async (req, res, next) => {
  const parcelId = req.params.parcelId;

  let parcel;
  try {
    parcel = await Parcel.findById(parcelId);
  } catch (err) {
    const error = new Error("Something went wrong, could not find a parcel.");
    error.code = 500;
    return next(error);
  }

  if (!parcel) {
    const error = new Error("Could not find a parcel for the provided id.");
    error.code = 404;
    return next(error);
  }

  res.json({ parcel: parcel.toObject({ getters: true }) });
};

const createParcel = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error("Invalid inputs passed, please check your data.");
    error.code = 422;
    return next(error);
  }

  const {
    parcelDescription,
    parcelWeight,
    parcelDimension,
    status,
    senderUsername,
    receiverUsername,
  } = req.body;

  const createdParcel = new Parcel({
    parcelDescription,
    parcelWeight,
    parcelDimension,
    status: "awaiting pickup",
    senderUsername,
    receiverUsername,
  });

  console.log(createdParcel);

  let senderUser;
  let receiverUser;
  let sess; // Declare sess at the top of the function

  try {
    senderUser = await User.findOne({ username: senderUsername });
    receiverUser = await User.findOne({ username: receiverUsername });

    if (!senderUser || !receiverUser) {
      const error = new Error("Could not find user for the provided username.");
      error.code = 404;
      throw error;
    }

    sess = await mongoose.startSession();
    sess.startTransaction();

    await createdParcel.save({ session: sess });

    // Update the sender's sentParcels
    senderUser.parcels = senderUser.parcels || {
      sentParcels: [],
      receivedParcels: [],
    };
    senderUser.parcels.sentParcels.push(createdParcel);

    await senderUser.save({ session: sess });

    // Update the receiver's receivedParcels
    receiverUser.parcels = receiverUser.parcels || {
      sentParcels: [],
      receivedParcels: [],
    };
    receiverUser.parcels.receivedParcels.push(createdParcel);

    await receiverUser.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    console.error(err);
    if (sess) {
      await sess.abortTransaction();
    }
    const error = new Error("Creating parcel failed, please try again.");
    error.code = 500;
    return next(error);
  } finally {
    if (sess) {
      sess.endSession();
    }
  }

  res.status(201).json({ parcel: createdParcel });
};

const updateParcelById = async (req, res, next) => {
  //only update parcel status
  const parcelId = req.params.parcelId;
  const { status } = req.body;

  let parcel;
  try {
    parcel = await Parcel.findById(parcelId);
  } catch (err) {
    const error = new Error(
      "Something went wrong, could not update parcel status."
    );
    error.code = 500;
    return next(error);
  }

  if (!parcel) {
    const error = new Error("Could not find parcel for the provided id.");
    error.code = 404;
    return next(error);
  }

  parcel.status = status;

  try {
    await parcel.save();
  } catch (err) {
    const error = new Error("Something went wrong, could not update parcel.");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ parcel: parcel.toObject({ getters: true }) });
};

exports.getParcels = getParcels;
exports.getParcelsByUserId = getParcelsByUserId;
exports.getParcelById = getParcelById;
exports.createParcel = createParcel;
exports.updateParcelById = updateParcelById;
//exports.validateCode = validateCode;
