import Users from '../models/Users.js';
import Media from "../models/Media.js";
import Posts from "../models/Posts.js";
import fs from "fs";
import path from "path";

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
            if (req.files) {
                req.files.forEach(file => {
                    try {
                        fs.unlinkSync(path.resolve(file.path));
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
    },
    getPosts: async (req, res) => {
        try {
            const {id: userId} = req.user;
            let page = +req.query.page;
            let limit = +req.query.limit;
            let offset = (page - 1) * limit;
            const totalPosts = Posts.count()

            const maxPageCount = Math.ceil(totalPosts/limit);

            const user = await Users.findByPk(userId);

            if (!user) {
                res.status(404).json({
                    message: 'User not found',
                    user: []
                });

                return;
            }

            if(page > maxPageCount) {
                res.status(404).json({
                    message: 'Posts does not found.',
                    posts: []
                });

                return ;
            }

            const posts = await Posts.findAll({
                attributes: ['id','description', 'createdAt'],
                include: [
                    {
                        model: Users,
                        attributes: ['id', 'email', 'username'],
                        include: [
                            {
                                model: Media,
                                as: 'avatar',
                                attributes: ['path'],
                            },
                        ],
                    },
                    {
                        model: Media,
                        attributes: ['path', 'createdAt', 'postId'],
                    },
                ],
                order: [['id', 'DESC']],
                limit,
                offset,
            });
            res.status(200).json({
                message: 'Posts list',
                page,
                limit,
                posts
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
            return res.status(500).json({
                message: 'Failed to fetch posts',
                error: error.message,
            });
        }
    },
}