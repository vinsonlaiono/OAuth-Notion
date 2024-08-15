// import all the things we need
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/Users');

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                client_id: process.env.NOTION_KEY,
                clientSecret: process.env.GOOGLE_SECRET,
                callbackURL: '/auth/notion/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log("🚀 ~ file: passport.js ~ line 16 ~ profile", profile)
                //get the user data from google

                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value,
                    email: profile.emails[0].value,
                };
                
                try {
                    //find the user in our database
                    let user = await User.findOne({googleId: profile.id});

                    if (user) {
                        //If user present in our database.
                        done(null, user);
                    } else {
                        // if user is not present in our database save user data to database.
                        user = await User.create(newUser);
                        console.log("🚀 ~ file: passport.js ~ line 38 ~ user", user)
                        
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        )
    );

    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
};
