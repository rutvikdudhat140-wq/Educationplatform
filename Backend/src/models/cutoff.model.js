import mongoose from "mongoose";

const cutoffSchema = new mongoose.Schema(
    {
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true
        },

        examSessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExamSession",
            required: true
        },

        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
            required: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        category: {
            type: String,
            default: "OPEN"
        },

        gender: {
            type: String,
            default: "ALL"
        },

        quota: {
            type: String,
            default: "HOME_STATE"
        },

        round: {
            type: Number,
            required: true
        },

        year: {
            type: Number,
            required: true
        },

        openingRank: {
            type: Number,
            required: true
        },

        closingRank: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Cutoff", cutoffSchema);
