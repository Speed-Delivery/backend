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
    const error = new HttpError(
      "Fetching parcels failed, please try again later.",
      500
    );
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
    const error = new HttpError(
      "Fetching user data failed, please try again later.",
      500
    );
    return next(error);
  }

  // Check if user exists
  if (!userWithParcels) {
    return next(
      new HttpError("Could not find a user with the provided user id.", 404)
    );
  }

  // Check if user has sent parcels
  if (userWithParcels.sentParcels.length === 0) {
    return next(new HttpError("User has not sent any parcels.", 404));
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
    const error = new HttpError(
      "Something went wrong, could not find a parcel.",
      500
    );
    return next(error);
  }

  if (!parcel) {
    const error = new HttpError(
      "Could not find a parcel for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ parcel: parcel.toObject({ getters: true }) });
};

const createParcel = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    parcelDescription,
    parcelWeight,
    parcelDimension,
    status,
    sender,
    recipient,
  } = req.body;

  let senderUser, receiverUser, sess;
  let createdParcel;

  try {
    // Find the users by their full name
    senderUser = sender.name
      ? await User.findOne({ fullName: sender.name })
      : null;
    receiverUser = recipient.name
      ? await User.findOne({ fullName: recipient.name })
      : null;

    createdParcel = new Parcel({
      parcelDescription,
      parcelWeight,
      parcelDimension,
      status,
      sender: {
        name: sender.name,
        address: sender.address,
        phone: sender.phone,
        email: sender.email,
        user: senderUser ? senderUser._id : null,
      },
      recipient: {
        name: recipient.name,
        address: recipient.address,
        phone: recipient.phone,
        email: recipient.email,
        user: receiverUser ? receiverUser._id : null,
      },
    });

    sess = await mongoose.startSession();
    sess.startTransaction();

    await createdParcel.save({ session: sess });

    if (senderUser) {
      senderUser.sentParcels.push(createdParcel);
      await senderUser.save({ session: sess });
    }

    if (receiverUser) {
      receiverUser.receivedParcels.push(createdParcel);
      await receiverUser.save({ session: sess });
    }

    await sess.commitTransaction();
  } catch (err) {
    console.error(err);
    if (sess) {
      await sess.abortTransaction();
    }
    const error = new HttpError(
      "Creating parcel failed, please try again.",
      500
    );
    return next(error);
  } finally {
    if (sess) {
      sess.endSession();
    }
  }

  res.status(201).json({ parcel: createdParcel });
};

const updateParcelById = async (req, res, next) => {
  const parcelId = req.params.parcelId;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(parcelId)) {
    return next(new HttpError("Invalid parcel ID", 400));
  }

  if (!["awaiting pickup", "in transit", "delivered"].includes(status)) {
    return next(new HttpError("Invalid status value", 400));
  }

  let parcel;
  try {
    parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      throw new HttpError("Could not find a parcel for the provided id.", 404);
    }

    parcel.status = status;
    await parcel.save();
  } catch (err) {
    const error =
      err instanceof HttpError
        ? err
        : new HttpError("Something went wrong, could not update parcel.", 500);
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
