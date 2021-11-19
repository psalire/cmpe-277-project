import express from "express";
import crypto from "crypto";
import MySQLDatabase from "./MySQLDatabase";
import passport from "passport";
import LocalStrategy from "passport-local";

const router = express.Router();

passport.use(new LocalStrategy.Strategy((username, password, done) => {
    MySQLDatabase.getUsernameSaltPassword(username, (err, results, field) => {
        if (err) {
            return done(err);
        }
        if (results.length == 0 || !results[0].salt) {
            return done(null, false, { message: "Incorrect username or password." });
        }

        crypto.pbkdf2(password, results[0].salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) {
                return done(err);
            }
            if (!crypto.timingSafeEqual(results[0].password, hashedPassword)) {
                return done(null, false, { message: "Incorrect username or password." });
            }

            return done(null, { message: "Logged in" });
        });
    });
}));

passport.serializeUser((user, done) => {
    process.nextTick(() => {
        done(null, { username: user.username });
    });
});

passport.deserializeUser((user, done) => {
    process.nextTick(() => {
        return done(null, user);
    });
});

// Probably move this to redis
var codes = {};

router.post("/register", (req, res, next) => {
    console.log(req.body);
    MySQLDatabase.selectUser(req.body.email, req.body.username, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(403).end();
            return;
        }
        if (results.length != 0) {
            console.log("found a user");
            res.status(403).end();
            return;
        }
        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) {
                console.error(err);
                res.status(403).end();
                return;
            }
            codes[req.body.email] = {
                username: req.body.username,
                password: hashedPassword,
                salt: salt,
                phone: req.body.phone,
                code: crypto.randomInt(999999).toString().padStart(6, "0")
            };
            console.log(codes[req.body.email]);
            res.status(200).end();
        });
    });
});

router.post("/verify", (req, res) => {
    console.log(codes[req.body.email], req.body.code);

    if (req.body.email && req.body.code && (codes[req.body.email].code == req.body.code)) {
        MySQLDatabase.insertUser(
            req.body.email,
            codes[req.body.email].username,
            codes[req.body.email].password,
            codes[req.body.email].salt,
            codes[req.body.email].phone,
            (err, results, fields) => {
                if (err) {
                    console.error(err);
                    res.status(403).end();
                    return;
                }
                res.status(200).end();
            }
        );
    }
    else {
        console.log("verify fail");
        res.status(403).end();
    }
});

router.post("/login", passport.authenticate('local'), (req, res) => {
    console.log("success");
    res.status(200).end();
});

export default router;
