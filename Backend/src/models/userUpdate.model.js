import mongoose from 'mongoose';

// One row per student per record: a saved update row carries updateId,
// an alert read row carries alertId.
const userUpdateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EducationUpdate',
    },
    alertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EducationAlert',
    },
    saved: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userUpdateSchema.index({ userId: 1, updateId: 1, alertId: 1 });

const UserUpdate = mongoose.model('UserUpdate', userUpdateSchema);

export default UserUpdate;
