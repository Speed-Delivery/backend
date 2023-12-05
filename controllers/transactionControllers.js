const mongoose = require("mongoose");

const Transaction = require("../models/TransactionModel");
const Parcel = require("../models/ParcelModel");
const Locker = require("../models/LockerModel");

const getTransactions = async (req, res) => {
  let transactions;
  try {
    transactions = await Transaction.find();
    res.json({
      transactions: transactions.map((transaction) =>
        transaction.toObject({ getters: true })
      ),
    });
  } catch (err) {
    console.error("Fetching transactions failed:", err);
    res
      .status(500)
      .send("Fetching transactions failed, please try again later.");
  }
};

const getTransactionById = async (req, res) => {
  const transactionId = req.params.tid;

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      res
        .status(404)
        .send("Could not find transaction for the provided transaction id.");
    } else {
      res.json({ transaction: transaction.toObject({ getters: true }) });
    }
  } catch (err) {
    console.error("Fetching transaction failed:", err);
    res
      .status(500)
      .send("Fetching transaction failed, please try again later.");
  }
};

const createTransaction = async (req, res) => {
  const { parcelId } = req.body; // Only parcelId is needed
  let existingParcel;
  let sess;

  try {
    sess = await mongoose.startSession();
    sess.startTransaction();

    existingParcel = await Parcel.findById(parcelId)
      .populate("sender", "name address email")
      .populate("recipient", "name address email")
      .session(sess);

    if (!existingParcel) {
      res.status(404).send("Could not find parcel for the provided parcel id.");
      return;
    }

    const createdTransaction = new Transaction({
      parcelId,
      parcelStatus: "attempted delivery",
      lockerId: "5f9d3b9b0f0e7c2b3c7e2b3c",
    });

    const result = await createdTransaction.save({ session: sess });
    await sess.commitTransaction();

    res.status(201).json({ transaction: result.toObject({ getters: true }) });
  } catch (err) {
    console.error("Creating transaction failed:", err);
    if (sess) {
      await sess.abortTransaction();
    }
    res.status(500).send("Creating transaction failed, please try again.");
  } finally {
    if (sess) {
      sess.endSession();
    }
  }
};

const updateTransaction = async (req, res) => {
  const transactionId = req.params.transactionId;
  const { lockerId, parcelStatus } = req.body; // Assuming these are the fields you want to update
  let sess;

  try {
    sess = await mongoose.startSession();
    sess.startTransaction();

    const existingTransaction = await Transaction.findById(
      transactionId
    ).session(sess);

    if (!existingTransaction) {
      res.status(404).send("Transaction not found for the provided ID.");
      return;
    }

    // Update the fields of the transaction
    existingTransaction.lockerId = lockerId;
    existingTransaction.parcelStatus = parcelStatus;

    const result = await existingTransaction.save({ session: sess });
    await sess.commitTransaction();

    res.status(200).json({ transaction: result.toObject({ getters: true }) });
  } catch (err) {
    console.error("Updating transaction failed:", err);
    if (sess) {
      await sess.abortTransaction();
    }
    res.status(500).send("Updating transaction failed, please try again.");
  } finally {
    if (sess) {
      sess.endSession();
    }
  }
};

exports.getTransactions = getTransactions;
exports.getTransactionById = getTransactionById;
exports.getTransactionByUserId = getTransactionById;
exports.createTransaction = createTransaction;
exports.updateTransaction = updateTransaction;
