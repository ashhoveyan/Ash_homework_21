import Users from '../models/Users.js';
import Media from "../models/Media.js";
import Posts from "../models/Posts.js";
import fs from "fs";

export default {
    createPosts: async (req, res) => {
        const files = req.files ? req.files.map(file => file.path.replace('public/', '')) : [];

        try {
            const {description} = req.body;
            const { id } = req.user;

            const post = await Posts.create({
                description,
                userId: id,
            });


            if (files.length > 0) {
                const mediaEntries = files.map(filePath => ({
                    path: filePath,
                    postId: post.id,
                }));

                await Media.bulkCreate(mediaEntries);
            }

            const result = await Posts.findByPk(post.id, {
                include: [
                    {
                        model: Media,
                        attributes: ['path'],
                    },
                ],
            });
            return res.status(201).json({
                message: 'Post created successfully',
                post: result,
            });
        }catch(err) {
            console.error('Create Post Error:', err);
            if (files.length > 0) {
                files.forEach(filePath => {
                    try {
                        fs.unlinkSync(`public/${filePath}`);
                    } catch (unlinkErr) {
                        console.error('Failed to delete file:', unlinkErr);
                    }
                });
            }
            return res.status(500).json({
                message: 'Failed to create post',
                error: err.message,
            });
        }
    }
}