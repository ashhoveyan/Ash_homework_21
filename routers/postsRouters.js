import {Router} from 'express';

import postsController from '../controllers/postsController.js';
import postsSchema from '../schemas/postsSchema.js';

import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/auth.js';

import fileUpload from "../middlewares/fileUpload.js";

const router = Router();

//apis

router.post(
    '/create',
    fileUpload.array('images', 5),
    authenticate,
    validate(postsSchema.createPost, 'body'),
    postsController.createPosts
);

router.get('/list/general',
    authenticate,
    validate(postsSchema.getPosts, 'query'),
    postsController.getPosts)

export default router;