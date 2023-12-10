const mongoose = require("mongoose");
const uuid = require("uuid");

const Locker = require("../models/LockerModel");

const initializeLockers = async () => {
  const cities = ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu"];
  const cabinetCount = 15;

  for (const city of cities) {
    const existingLocker = await Locker.findOne({ location: city });

    if (!existingLocker) {
      // Create a new locker if it doesn't exist
      const cabinets = [];
      for (let i = 1; i <= cabinetCount; i++) {
        const cabinetNumber = `DOOR ${i.toString().padStart(2, "0")}`;
        const code = generateCode();
        cabinets.push({ cabinetNumber, status: "available", code });
      }

      const newLocker = new Locker({
        location: city,
        cabinets: cabinets,
      });

      await newLocker.save();
    } else {
      if (existingLocker.cabinets.length < cabinetCount) {
        for (
          let i = existingLocker.cabinets.length + 1;
          i <= cabinetCount;
          i++
        ) {
          const cabinetNumber = `DOOR ${i.toString().padStart(2, "0")}`;
          const code = generateCode();
          existingLocker.cabinets.push({
            cabinetNumber,
            status: "available",
            code,
          });
        }

        await existingLocker.save();
      }
    }
  }
};

const getLockers = async (req, res, next) => {
  let lockers;
  try {
    lockers = await Locker.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching lockers failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    lockers: lockers.map((locker) => locker.toObject({ getters: true })),
  });
};

const getLockersByCity = async (req, res, next) => {
  const city = req.params.city;

  let lockers;
  try {
    lockers = await Locker.find({ location: city });
  } catch (err) {
    const error = new HttpError(
      "Fetching lockers failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!lockers) {
    return next(
      new HttpError("Could not find lockers for the provided location.", 404)
    );
  }

  res.json({
    lockers: lockers.map((locker) => locker.toObject({ getters: true })),
  });
};

const updateLockerById = async (req, res, next) => {
  const lockerId = req.params.lid;
  const { cabinetNumber, status, currentParcel } = req.body;

  let locker;
  try {
    locker = await Locker.findById(lockerId);
  } catch (err) {
    const error = new HttpError(
      "Fetching locker failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!locker) {
    return next(
      new HttpError("Could not find locker for the provided locker id.", 404)
    );
  }

  const cabinetIndex = locker.cabinets.findIndex(
    (cabinet) => cabinet.cabinetNumber === cabinetNumber
  );

  if (cabinetIndex === -1) {
    return next(
      new HttpError(
        "Could not find cabinet for the provided cabinet number.",
        404
      )
    );
  }

  locker.cabinets[cabinetIndex].status = status;
  // locker.cabinets[cabinetIndex].currentParcel = currentParcel;
  locker.cabinets[cabinetIndex].code = generateCode();
  locker.cabinets[cabinetIndex].cabinetStatusLastUpdated = Date.now();

  try {
    await locker.save();
  } catch (err) {
    const error = new HttpError(
      "Updating locker failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({ locker: locker.toObject({ getters: true }) });
};

const generateCode = () => {
  const code = uuid.v4().split("-")[0].toUpperCase();
  return code;
};

exports.initializeLockers = initializeLockers;
exports.getLockers = getLockers;
exports.getLockersByCity = getLockersByCity;
exports.updateLockerById = updateLockerById;
