import * as jwt from 'jsonwebtoken';
import * as uniqueid from 'unique-string'
import { Router, Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { User } from '../../models/user';
import { BaseRoute } from '../BaseRoute';

export class Auth extends BaseRoute {

    public loginAction(router: Router): void {
        router.post('/login', (req: Request, res: Response) => {
            let email = req.body.email;
            const re = /\S+@\S+\.\S+/;
            
            if (!re.test(email)) {
                res.status(400);
                res.json({
                    success: false,
                    message: 'wrong input.'
                });
                return false;
            }
            User.findOne({ where: {email: email} }).then((user: any) => {
                bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                    if (err) {
                        this.logger.error(err.toString());
                        res.status(500);
                        res.json({
                            success: false,
                            message: 'something went wrong.'
                        });
                    } else if (isMatch) {
                        const accessToken = jwt.sign(user.toJSON(), process.env.APPLICATION_SECRET, {
                            expiresIn:  process.env.TOKEN_LIFE
                        });

                        const refreshToken = uniqueid();
                        User.update(
                            {refreshToken: refreshToken},
                            {where: {id: user.id}}
                           );

                        res.json({
                            success: true,
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        });
                    } else {
                        res.status(400);
                        res.json({
                            success: false,
                            message: 'wrong credentials.'
                        });
                    }
                });
            });
        });
    }

    public registerAction(router: Router): void {
        router.post('/registration', (req: Request, res: Response) => {
            const re = /\S+@\S+\.\S+/;
            let { email, name, password, phone }  = req.body;
            if (!name || !re.test(email) || !password || password.length < 6) {
                res.status(400);
                res.json({
                    success: false,
                    message: 'wrong input.'
                });
                return false;
            }
            User.findOne({ where: {email: email} }).then(user => {
               if(user) {
                   res.status(400);
                   res.json({
                       success: false,
                       message: 'this email address has already been taken.'
                   });
               } else {
                   bcrypt.genSalt(10, (err, salt) => {
                       bcrypt.hash(password, salt, (err, hash) => {
                           if(err) throw err;
                           password = hash;
                           User.create({ name: name, email: email, phone: phone, password: password }).then(user => {
                               res.json({
                                   success: true,
                                   message: 'user created.'
                               });
                           })
                       });
                   });
               }
            });

        });
    }


    public refreshTokenAction(router: Router) {
        router.post('/refresh-token', (req: Request, res: Response) => {
           const {refreshToken, accessToken} = req.body;
            jwt.verify(accessToken, process.env.APPLICATION_SECRET, { ignoreExpiration: true },(err, user) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to refresh token.'
                    });
                } else {
                    User.findOne({ where: {refreshToken: refreshToken, id: user.id} }).then((user: any) => {

                        if(user){
                            const newAccessToken = jwt.sign(user.toJSON(), process.env.APPLICATION_SECRET, {
                                expiresIn:  process.env.TOKEN_LIFE
                            });
                            const newRefreshToken = uniqueid();
                            User.update(
                                {refreshToken: newRefreshToken},
                                {where: {id: user.id}}
                            );

                            res.json({
                                success: true,
                                accessToken: newAccessToken,
                                refreshToken: newRefreshToken
                            });
                        } else {
                            return res.json({
                                success: false,
                                message: 'Failed to refresh token.'
                            });
                        }
                    });
                }
            });

        });
    }

    public profileAction(router: Router): void {
        router.post('/profile', this.guard, (req: Request, res: Response) => {
            res.json({
                success: true,
                user: req.body.user
            });
        });
    }
}