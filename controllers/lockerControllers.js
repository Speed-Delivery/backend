const mongoose = require("mongoose");
const uuid = require("uuid");

const Locker = require("../models/LockerModel");

const initializeLockers = async (req, res, next) => {
  try {
    const cities = ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu"];
    const cabinetCount = 15;

    for (const city of cities) {
      const existingLocker = await Locker.findOne({ location: city });

      if (!existingLocker) {
        const cabinets = [];
        for (let i = 1; i <= cabinetCount; i++) {
          const cabinetNumber = `DOOR ${i.toString().padStart(2, "0")}`;
          cabinets.push({
            cabinetNumber,
            status: "available",
            currentParcel: null, // Assuming no parcel initially
            code: generateCode(),
          });
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
            existingLocker.cabinets.push({
              cabinetNumber,
              status: "available",
              currentParcel: null,
              code: generateCode(),
            });
          }

          await existingLocker.save();
        }
      }
    }

    res.status(201).json({ message: "Lockers initialized." });
  } catch (err) {
    const error = new Error(
      "Initializing lockers failed, please try again later."
    );
    error.statusCode = 500;
    return next(error);
  }
};

const generateCode = () => {
  const code = uuid.v4().split("-")[0].toUpperCase();
  return code;
};

const getLockers = async (req, res, next) => {
  let lockers;
  try {
    lockers = await Locker.find();
  } catch (err) {
    const error = new Error("Fetching lockers failed, please try again later.");
    error.statusCode = 500;
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
    const error = new Error("Fetching lockers failed, please try again later.");
    error.statusCode = 500;
    return next(error);
  }

  if (!lockers || lockers.length === 0) {
    const error = new Error("Could not find lockers for the provided city.");
    error.statusCode = 404;
    return next(error);
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
    const error = new Error("Fetching locker failed, please try again later.");
    error.statusCode = 500;
    return next(error);
  }

  if (!locker) {
    const error = new Error("Could not find locker for the provided id.");
    error.statusCode = 404;
    return next(error);
  }

  const cabinetIndex = locker.cabinets.findIndex(
    (cabinet) => cabinet.cabinetNumber === cabinetNumber
  );

  if (cabinetIndex === -1) {
    const error = new Error("Could not find cabinet for the provided number.");
    error.statusCode = 404;
    return next(error);
  }

  // Generate a unique code for the cabinet
  const newCode = generateCode(); // Assuming generateCode() will create a unique code

  // Update the cabinet details
  locker.cabinets[cabinetIndex].status = status;
  locker.cabinets[cabinetIndex].currentParcel = currentParcel;
  locker.cabinets[cabinetIndex].code = newCode;

  try {
    await locker.save();
  } catch (err) {
    const error = new Error("Updating locker failed, please try again later.");
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({ locker: locker.toObject({ getters: true }) });
};

exports.initializeLockers = initializeLockers;
exports.getLockers = getLockers;
exports.getLockersByCity = getLockersByCity;
exports.updateLockerById = updateLockerById;
