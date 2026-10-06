import mongoose from "mongoose";
import Exam from "../models/Exam.js";

const examRelations = [
    {
        path: "dates",
        populate: {
            path: "examSession",
            select: "academicYear sessionName",
        },
    },
    {
        path: "eligibility",
        populate: {
            path: "examSession",
            select: "academicYear sessionName",
        },
    },
    {
        path: "sessions",
    },
];

export const getExams = async (req, res) => {
    try {
        const exams = await Exam.find()
            .populate(examRelations);

        res.status(200).json({
            success: true,
            exams,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getExam = async (req, res) => {
    try {
        const id = req.params.id;
        const exam = await Exam.findOne({ _id: id })
            .populate(examRelations);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found",
            });
        }

        res.status(200).json({
            success: true,
            exam,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);

        res.status(201).json({
            success: true,
            exam,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(
            req.params.id,
            req.body,
          
        );

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found",
            });
        }

        res.status(200).json({
            success: true,
            exam,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Exam deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
