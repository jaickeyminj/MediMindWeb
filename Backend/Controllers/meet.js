const express = require('express');
const app = express();
const port = 8000;
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const Meeting = require('google-meet-api').meet;


clientID = "900631543829-0jjagfht4m75ehgv3in45elahvikhf6l.apps.googleusercontent.com"
clientSecret="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"

passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "http://medimind.in.net:27017/auth/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        Meeting({
            clientId: clientID,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            date: "2020-03-02",
            time: "11:59",
            summary: 'summary',
            location: 'location',
            description: 'description',
            checking:0
        }).then(function (result) {
            console.log(result);
        }).catch((error) => {
            console.log(error)
        });
        // console.log(result);
        return cb();
    }
));

app.get('/auth/callback',
    passport.authenticate('google', { failureRedirect: '/' })
);

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile','https://www.googleapis.com/auth/calendar'],
        accessType: 'offline',
        prompt: 'consent'
    }
    ));

app.get('/',function(req,res){
    res.send("done")
})

app.listen(port, function (err) {
    if (err) {
        console.log('something wrong in starting server !!!');
        return;
    }
    return console.log("server is up and running on port ", port);
});