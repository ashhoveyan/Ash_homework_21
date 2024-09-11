import { Router } from 'express';

import postsController from '../controllers/postsController.js';
import postsSchema from '../schemas/postsSchema.js';

import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/auth.js';

import fileUpload    from "../middlewares/fileUpload.js";




const router = Router();



//apis

router.post(
    '/create',
    fileUpload.array('posts', 5),
    validate(postsSchema.createPost, 'body'),
    authenticate,
    postsController.createPosts
);


export default router;