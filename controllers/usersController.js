import {v4 as uuid} from 'uuid';

import Users from '../models/Users.js';
import Media from "../models/Media.js";

import fs from "fs";
import jwt from "jsonwebtoken";

import {sendMail} from "../services/Mail.js";
import {Model as models} from "sequelize";

export default {
    registration: async (req, res) => {
        const avatarPath = req.file ? req.file.path.replace('public/', '') : null;
        try {
            //console.log(req.files)
            const {username, email, password} = req.body;

            const [user, created] = await Users.findOrCreate({
                where: {email},
                defaults: {
                    username,
                    email: email.toLowerCase(),
                    password
                }
            });
            if (!created) {
                if (req.file) {
                    try {
                       await fs.unlinkSync(req.file.path);
                    } catch (unlinkErr) {
                        console.error('File removal failed:', unlinkErr);
                    }
                }
                return res.status(409).json({
                    message: 'User already exists',
                });
            }

            if (avatarPath) {
                await Media.create({
                    userId: user.id,
                    path: avatarPath
                })
            }

            const result = await Users.findByPk(user.id, {
                include: [
                    {
                        model: Media,
                        as: 'avatar',
                        attributes: ['path'],
                    },
                ],
            });

            const activationKey = uuid()

            await Users.update({
                    activationKey,
            },{
                where: {id:user.id}

            })

            await sendMail({
                to: result.email,
                subject: 'Welcome to my project',
                template: 'userActivation',
                templateData: {
                    link: `http://localhost:3000/users/activate?key=${activationKey}`
                }

            })
            return res.status(201).json({
                message: 'User created successfully',
                user: result,
            });

        } catch (error) {
            console.error('Registration Error:', error);
            if (req.file) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (unlinkErr) {
                    console.error('File removal failed:', unlinkErr);
                }
            }
            return res.status(500).json({
                message: 'registration failed',
                error: error.message,
            });
        }
    },

    activate: async (req,res) =>{
        try {
            const {key}  = req.query;
            const user = await Users.findOne({
                where: { activationKey : key }
            });

            if (!user) {
                 res.status(404).json({
                    message:'User does not exist',
                })
                return ;
            }
            if (user.status === 'active') {
                res.status(200).json({
                    message:'User already activated',
                })
                return ;
            }
            await Users.update({
                status: 'active',
            },{
                where: {
                    id:user.id
                }

            })

            return res.status(200).json({
                message: 'User activated successfully',
            })
        }catch (e){
            console.error('Activation error:', e);
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            })
        }
    },

    login: async (req, res) => {
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({
                where: {email},

            });
            const hashedPassword = Users.hash(password)

            if (!user || hashedPassword !== user.getDataValue("password")) {
                return res.status(400).json({
                    message: 'Invalid Email or password'
                });
            }

            if (user.status !== 'active'){
                return res.status(401).json({
                    message: 'pls confirm your email address',
                })
            }

            const payload = {
                id: user.id,
                email: user.email,
            };

            const token = jwt.sign(
                payload,
                process.env.SECRET_FOR_JWT, {
                    expiresIn: '24h',
                });

            console.log(token)
            console.log(user)

            if (user.type === "admin") {
                return res.status(200).json({
                    message: 'Admin logged in successfully',
                    user: user,
                    token: token,
                    isAdmin: true
                });
            }

            return res.status(200).json({
                message: 'User logged in successfully',
                user: user,
                token: token,
                isAdmin: false
            });

        } catch (error) {
            console.error('Login Error:', error);
            return res.status(500).json({
                message: 'Login failed',
                error: error.message
            });
        }
    }
}