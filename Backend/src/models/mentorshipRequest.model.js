import mongoose from 'mongoose';

const mentorshipRequestSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    careerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    mentorName: { type: String, required: true },
    topic: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Accepted', 'Scheduled', 'Completed', 'Cancelled'], 
      default: 'Pending' 
    }
  },
  { timestamps: true }
);

export default mongoose.model('MentorshipRequest', mentorshipRequestSchema);
