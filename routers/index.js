import { Router } from 'express';

import usersRoutes from './usersRouters.js';
import postsRoutes from './postsRouters.js';

const router = Router();


router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);



export default router;