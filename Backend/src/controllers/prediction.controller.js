
import ExamSession from "../models/ExamSession.js";
import Cutoff from "../models/cutoff.model.js";
import RankPredictionRule from "../models/rankPredictionRule.model.js";



export const getPredictorSessions = async (req, res) => {

    const filter = {};

    if (req.query.examId) {
        filter.exam = req.query.examId;
    }

    const examSessions = await ExamSession.find(filter)
        .sort({
            academicYear: -1,
            sessionName: 1
        });

    res.json({
        examSessions
    });
};


export const listCutoffs = async (req, res) => {

    const filter = {};

    if (req.query.examId) {
        filter.examId = req.query.examId;
    }

    if (req.query.examSessionId) {
        filter.examSessionId = req.query.examSessionId;
    }

    if (req.query.collegeId) {
        filter.collegeId = req.query.collegeId;
    }

    if (req.query.courseId) {
        filter.courseId = req.query.courseId;
    }

    if (req.query.category) {
        filter.category = req.query.category.toUpperCase();
    }

    if (req.query.gender) {
        filter.gender = req.query.gender.toUpperCase();
    }

    if (req.query.quota) {
        filter.quota = req.query.quota.toUpperCase();
    }

    if (req.query.round) {
        filter.round = Number(req.query.round);
    }

    if (req.query.year) {
        filter.year = Number(req.query.year);
    }

    const cutoffs = await Cutoff.find(filter)
        .populate([
            {
                path: "examId",
                select: "name shortName",
            },
            {
                path: "examSessionId",
                select: "academicYear sessionName",
            },
            {
                path: "courseId",
                select: "name fullName stream level",
            },
            {
                path: "collegeId",
                select: "name",
            },
        ])
        .sort({
            year: -1,
            round: 1,
            closingRank: 1,
        });

    res.json({
        cutoffs
    });
};


export const getCutoff = async (req, res) => {

    const cutoff = await Cutoff.findById(req.params.id);

    res.json({
        cutoff
    });
};



export const createCutoff = async (req, res) => {

    const cutoff = await Cutoff.create(req.body);

    res.json({
        cutoff
    });
};


export const updateCutoff = async (req, res) => {

    const cutoff = await Cutoff.findByIdAndUpdate(
        req.params.id,
        req.body,
    );

    res.json({
        cutoff
    });
};


export const deleteCutoff = async (req, res) => {

    await Cutoff.findByIdAndDelete(req.params.id);

    res.json({
        message: "Cutoff deleted"
    });
};


export const listRules = async (req, res) => {

    const rules = await RankPredictionRule.find()
        .sort({
            createdAt: -1
        });

    res.json({
        rules
    });
};


// Create Rank Prediction Rule
export const createRule = async (req, res) => {

    const rule = await RankPredictionRule.create(req.body);

    res.json({
        rule
    });
};


export const updateRule = async (req, res) => {

    const rule = await RankPredictionRule.findByIdAndUpdate(
        req.params.id,
        req.body,
    );

    res.json({
        rule
    });
};


export const deleteRule = async (req, res) => {

    await RankPredictionRule.findByIdAndDelete(req.params.id);

    res.json({
        message: "Rule deleted"
    });
};


export const rankPredictor = async (req, res) => {

    const filter = {
        examId: req.body.examId,
        examSessionId: req.body.examSessionId,
        predictionMethod: req.body.predictionMethod,

        inputFrom: {
            $lte: Number(req.body.input)
        },

        inputTo: {
            $gte: Number(req.body.input)
        }
    };

    if (
        req.body.category &&
        req.body.category !== "ALL"
    ) {
        filter.category = {
            $in: [
                req.body.category.toUpperCase(),
                "ALL"
            ]
        };
    }

    const rule = await RankPredictionRule.findOne(filter);

    let prediction = null;

    if (rule) {

        prediction = {
            expectedRankFrom: rule.expectedRankFrom,
            expectedRankTo: rule.expectedRankTo,
            predictionMethod: rule.predictionMethod
        };
    }

    res.json({
        prediction
    });
};


export const collegePredictor = async (req, res) => {

    const rank = Number(req.body.rank);

    const filter = {
        examId: req.body.examId,
        examSessionId: req.body.examSessionId,

        openingRank: {
            $lte: rank
        },

        closingRank: {
            $gte: rank
        }
    };



    if (
        req.body.category &&
        req.body.category !== "ALL"
    ) {
        filter.category = {
            $in: [
                req.body.category.toUpperCase(),
                "ALL"
            ]
        };
    }



    if (
        req.body.gender &&
        req.body.gender !== "ALL"
    ) {
        filter.gender = {
            $in: [
                req.body.gender.toUpperCase(),
                "ALL"
            ]
        };
    }



    if (
        req.body.quota &&
        req.body.quota !== "ALL"
    ) {
        filter.quota = {
            $in: [
                req.body.quota.toUpperCase(),
                "ALL"
            ]
        };
    }

    if (req.body.courseIds) {
        filter.courseId = req.body.courseIds;
    }


    const cutoffs = await Cutoff.find(filter)
        .populate([
            {
                path: "examId",
                select: "name shortName",
            },
            {
                path: "examSessionId",
                select: "academicYear sessionName",
            },
            {
                path: "courseId",
                select: "name fullName stream level",
            },
            {
                path: "collegeId",
                select: "name",
            },
        ])
        .sort({
            year: -1,
            round: 1,
            closingRank: 1,
        });


    const results = cutoffs.map((cutoff) => {

        return {

            collegeId: cutoff.collegeId,

            courseId: cutoff.courseId,

            examId: cutoff.examId,

            examSessionId: cutoff.examSessionId,

            category: cutoff.category,

            gender: cutoff.gender,

            quota: cutoff.quota,

            round: cutoff.round,

            openingRank: cutoff.openingRank,

            historicalClosingRank: cutoff.closingRank,

            studentRank: rank,

            chanceLevel: "Good Chance"
        };
    });


    res.json({

        results,

        total: results.length,

        page: 1,

        limit: 20,

        pages: Math.ceil(results.length / 20) || 1

    });
};

