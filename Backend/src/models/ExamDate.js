import mongoose from "mongoose";

const examDateSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
        },

        examSession: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExamSession",
        },

        registrationStartDate: {
            type: Date,
            default: null,
        },

        registrationEndDate: {
            type: Date,
            default: null,
        },

        correctionStartDate: {
            type: Date,
            default: null,
        },

        correctionEndDate: {
            type: Date,
            default: null,
        },

        admitCardDate: {
            type: Date,
            default: null,
        },

        examStartDate: {
            type: Date,
            default: null,
        },

        examEndDate: {
            type: Date,
            default: null,
        },

        answerKeyDate: {
            type: Date,
            default: null,
        },

        resultDate: {
            type: Date,
            default: null,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

examDateSchema.index(
    { examSession: 1 },
    { unique: true }
);

const ExamDate = mongoose.model("ExamDate", examDateSchema);

export default ExamDate;
