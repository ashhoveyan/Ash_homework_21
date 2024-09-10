import md5 from 'md5';
import jwt from 'jsonwebtoken';

import Users from '../models/Users.js';
import {Sequelize, where} from "sequelize";
import sequelize from "../clients/sequelize.mysql.js";

export default {
    registration:async (req, res) =>{
        const avatar = req.file ? req.file.path : null;
        try{
            console.log(req.files)
            const {username, email, password} = req.body;


            const [user, created] = await Users.findOrCreate({
                where: { email },
                defaults: {
                    username,
                    email:email.toLowerCase(),
                    password,
                    avatar,
                }
            });
            if (!created) {

                if (avatar) {
                    fs.unlinkSync(avatar);
                }

                return res.status(409).json({
                    message: 'User already exists',
                });
            } else {
                return res.status(201).json({
                    message: 'User created successfully',
                    user: user,
                });
            }
        }catch (error) {
            console.error('Registration Error:', error);
            if (avatar) {
                fs.unlinkSync(avatar);
            }
            return res.status(500).json({
                message: 'registration failed',
                error: error.message,
            });
        }
    },
    login:async (req, res) =>{
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({
                where: {email},

            });
            const hashedPassword = Users.hash(password)


            if (!user || hashedPassword !== user.getDataValue("password")) {
                return res.status(400).json({
                    message: 'Invalid email or password'
                });
            }

            const payload = {

                id: user.id,
                email:user.email
            };

            const token = jwt.sign(
                payload,
                process.env.SECRET_FOR_JWT, {
                    expiresIn: '24h'
                });


            console.log(token)
             console.log(user)


            if (user.type === "admin"){
                return res.status(200).json({
                    message: 'Admin logged in successfully',
                    user: user,
                    token: token,
                    isAdmin:true
                });
            }

            return res.status(200).json({
                message: 'User logged in successfully',
                user: user,
                token: token,
                isAdmin:false
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