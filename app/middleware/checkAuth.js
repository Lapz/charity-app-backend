const jwt = require('jwt-simple');
const Account = require("../models/account.js");

const passport = require("passport")
/**
 *  The Auth Checker middleware function.
 */

function getToken(headers) {
    if (headers && headers.authorization) {
        const parted = headers
            .authorization
            .split(" ");

        if (parted.length === 2) {
            return parted[1]
        } else {
            return null
        }
    } else {
        return null
    }
}
module.exports = (req, res, next) => {
    passport.authenticate("jwt", {
        session: false
    }, (err) => {
        const token = getToken(req.headers)

        if (token) {
            let decoded
            try {
                decoded = jwt.decode(token, process.env.JWT_SECRET);
            } catch (err) {
                return next(err)
            }

            Account.findOne({
                username: decoded.username
            }, (err, user) => {
                if (err) 
                    throw(err)

                if (!user) {
                    return res
                        .status(403)
                        .send({success: false, msg: 'Authentication failed. User not found.'});
                } else {
                    // res.json({     success: true,     msg: 'Welcome in the member area ' +
                    // user.username + '!' });
                    next()
                }
            })

        } else {
            return res
                .status(401.)
                .send({success: false, msg: "No token provided"})
        }
    })(req, res, next)
};