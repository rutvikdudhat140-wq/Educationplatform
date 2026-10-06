import express from 'express';
import authMiddleware, { adminMiddleware } from '../middleware/auth.middleware.js';
import {
    RESOURCE_HANDLER_SETS,
    resourceTypeFromMount,
} from '../controllers/examResourceController.js';

/**
 * One router per resource type, all sharing the ExamResource controller.
 * Reads are public; writes require an admin token.
 *
 * The resource type is derived from the mount path so a caller can never
 * write a syllabus into the FAQ collection by sending `type` in the body.
 */
const buildRouter = (mountPath, resourceType) => {
    const router = express.Router();
    const {
        getResources,
        getResourceById,
        createResource,
        updateResource,
        deleteResource,
    } = RESOURCE_HANDLER_SETS[resourceType];

    router.get('/', getResources);
    router.get('/:id', getResourceById);

    router.post('/', authMiddleware, adminMiddleware, createResource);
    router.put('/:id', authMiddleware, adminMiddleware, updateResource);
    router.delete('/:id', authMiddleware, adminMiddleware, deleteResource);

    return router;
};

export { buildRouter, resourceTypeFromMount };
