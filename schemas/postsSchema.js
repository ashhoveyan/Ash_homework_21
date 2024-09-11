import Joi from 'joi';

export default {
    createPost: Joi.object({
        description: Joi.string().min(1).max(100).optional(),
    }),

};