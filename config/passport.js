import { User } from "../models/User.js";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
dotenv.config();

const initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false);

        if (user.password !== password) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, {
        id: user.id,
        username: user.username,
        name: user.name,
      });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};

// login function

const isAuthenticated = (req, res, next) => {
  if (req.user) {
    console.log(req.user);
    return next();
  }
  res.redirect("/login");
};

export { initializingPassport, isAuthenticated, initializingPassportgoogle };
