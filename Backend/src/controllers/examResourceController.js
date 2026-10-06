import ExamResource, { RESOURCE_TYPES } from '../models/ExamResource.js';
import Exam from '../models/Exam.js';
import { stripEmptyValues } from '../utils/relaxedValidation.js';

/**
 * `resourceType` is injected by the route factory so one controller serves the
 * syllabus, sample paper, mock test and FAQ endpoints.
 */
const buildFilter = (req, resourceType) => {
    const filter = { type: resourceType };

    if (req.query.exam) filter.exam = req.query.exam;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
        const search = new RegExp(String(req.query.search).trim(), 'i');

        filter.$or = [{ title: search }, { description: search }];
    }

    return filter;
};

export const getExamResources = (resourceType) => async (req, res) => {
    try {
        const data = await ExamResource.find(buildFilter(req, resourceType))
            .populate('exam', 'name shortName stream')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data });
    } catch {
        res.status(500).json({
            success: false,
            message: `Failed to fetch ${resourceType.toLowerCase()}s`,
        });
    }
};

export const getExamResourceById = (resourceType) => async (req, res) => {
    try {
        const data = await ExamResource.findOne({
            _id: req.params.id,
            type: resourceType,
        }).populate('exam', 'name shortName stream');

        if (!data) {
            return res.status(404).json({
                success: false,
                message: `${resourceType} not found`,
            });
        }

        res.status(200).json({ success: true, data });
    } catch {
        res.status(500).json({
            success: false,
            message: `Failed to fetch ${resourceType.toLowerCase()}`,
        });
    }
};

export const createExamResource = (resourceType) => async (req, res) => {
    try {
        const payload = stripEmptyValues({ ...req.body, type: resourceType });

        if (!payload.exam) {
            return res.status(400).json({
                success: false,
                message: 'Exam is required',
            });
        }

        const examExists = await Exam.exists({ _id: payload.exam });

        if (!examExists) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found',
            });
        }

        const data = await ExamResource.create(payload);

        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || `Failed to create ${resourceType.toLowerCase()}`,
        });
    }
};

export const updateExamResource = (resourceType) => async (req, res) => {
    try {
        const data = await ExamResource.findOneAndUpdate(
            { _id: req.params.id, type: resourceType },
            { $set: stripEmptyValues(req.body) },
            { returnDocument: 'after', runValidators: true }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: `${resourceType} not found`,
            });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || `Failed to update ${resourceType.toLowerCase()}`,
        });
    }
};

export const deleteExamResource = (resourceType) => async (req, res) => {
    try {
        const data = await ExamResource.findOneAndDelete({
            _id: req.params.id,
            type: resourceType,
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: `${resourceType} not found`,
            });
        }

        res.status(200).json({
            success: true,
            message: `${resourceType} deleted successfully`,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: `Failed to delete ${resourceType.toLowerCase()}`,
        });
    }
};

/**
 * Binds each resource type to its own set of handlers so the same controller
 * can back /api/exam-syllabus, /api/exam-sample-paper, /api/exam-mock-test and
 * /api/exam-faq without a client ever having to send `type` in the body.
 */
export const RESOURCE_HANDLER_SETS = Object.fromEntries(
    RESOURCE_TYPES.map((type) => [
        type,
        {
            resourceType: type,
            getResources: getExamResources(type),
            getResourceById: getExamResourceById(type),
            createResource: createExamResource(type),
            updateResource: updateExamResource(type),
            deleteResource: deleteExamResource(type),
        },
    ])
);

const MOUNT_TO_TYPE = {
    '/api/exam-syllabus': 'Syllabus',
    '/api/exam-sample-paper': 'Sample Paper',
    '/api/exam-mock-test': 'Mock Test',
    '/api/exam-faq': 'FAQ',
};

export const resourceTypeFromMount = (mountPath) => {
    const type = MOUNT_TO_TYPE[mountPath];

    if (!type) {
        throw new Error(`No exam resource type mapped to ${mountPath}`);
    }

    return type;
};
