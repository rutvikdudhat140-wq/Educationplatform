import mongoose from 'mongoose';

/**
 * Atomic sequence generator.
 *
 * Certificate IDs used to be derived from `countDocuments() + 1`, which is not
 * safe: two certificates issued in the same millisecond both read the same
 * count, and deleting a certificate makes the count go *down* so the next
 * issued certificate collides with an existing one. `$inc` on a single document
 * is atomic, so concurrent issuers always receive distinct sequence numbers.
 */
const counterSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Counter', counterSchema);
