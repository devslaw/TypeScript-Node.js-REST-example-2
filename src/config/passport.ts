import { Strategy, ExtractJwt } from 'passport-jwt';
import { Passport } from 'passport';

import { User } from '../models/user';

/**
 * passport jwt configuration
 */
export class PassportConfig {

    public passport: Passport;

    constructor(passport: any){
        this.passport = passport;
    }

    public init() {
        let opts = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            secretOrKey: process.env.APPLICATION_SECRET
        };
        this.passport.use(new Strategy(opts, (jwtPayload, done) => {
            User.findOne({ where: {id: jwtPayload._doc._id} }).then(user => {
                return done(null, user);

            }).catch((err) => {
                return done(null, err);
            });
        }));
    }
}
