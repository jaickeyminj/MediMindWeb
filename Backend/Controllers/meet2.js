// import  express  from "express";
const { google } = require("googleapis");
// const axios = require("axios");
const dayjs = require("dayjs");
const { v4: uuid } = require("uuid");

const calendar = google.calendar({
    version: "v3",
    auth: "AIzaSyD-WcnVeN8ZpdPFdx43GX-smyWk-pSEYao"
});

const oauth2Client = new google.auth.OAuth2(
    "695738836432-q6e95lmhsof2eteblf9m9i1pmg0f5kcm.apps.googleusercontent.com",
    "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",
    "http://localhost:27017/api/v1/patient/handleGoogleRedirect"
);

const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

async function redirectToGoogle(req, res) {
    console.log("redirect");
    const URL = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    res.redirect(URL);
}

async function handleGoogleRedirect(req, res) {
    const code = req.query.code;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        // console.log(tokens);
        // console.log(oauth2Client);
        res.redirect("/api/v1/patient/scheduleEvent");
    } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        res.status(500).send("Failed to authenticate with Google Calendar API.");
    }
}

async function scheduleEvent(req, res) {
    try {
        const result = await calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            conferenceDataVersion: 1,
            requestBody: {
                summary: "Doctor's Appointment",
                description: "MediMind Health Care ",
                start: {
                    dateTime: dayjs(new Date()).add(1, 'day').toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                end: {
                    dateTime: dayjs(new Date()).add(1, 'day').add(1, 'hour').toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                conferenceData: {
                    createRequest: {
                        requestId: uuid(),
                    }
                },
                attendees: [{
                    email: "jaickey09@gmail.com",
                }]
            }
        });
        // console.log("Scheduling Meeting");
        console.log(result.data.hangoutLink);
        res.status(200).json({
            success:"true",
            msg: "Link Generated",
            link: result.data.hangoutLink,
        });
    } catch (error) {
        console.error("Error scheduling event:", error);
        res.status(500).send("Failed to schedule event.");
    }
}

exports.redirectToGoogle = redirectToGoogle;
exports.handleGoogleRedirect = handleGoogleRedirect;
exports.scheduleEvent = scheduleEvent;
