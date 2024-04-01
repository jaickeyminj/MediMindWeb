const express = require("express");
const { google } = require("googleapis");
const dayjs = require("dayjs");
const { v4: uuid } = require("uuid");
const jwt = require('jsonwebtoken');
const moment = require('moment');

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

async function handleAppointment(req, res) {
    try {
        // Verify token
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader ? authorizationHeader.substring('Bearer '.length) : null;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not provided',
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                });
            }

            const appointmentId = req.body.appointmentId;
            const code = req.query.code;

            await redirectToGoogle(req, res, appointmentId);
            await handleGoogleRedirect(req, res, code);
            await scheduleEvent(req, res, appointmentId);
        });
    } catch (error) {
        console.error("Error handling appointment:", error);
        return res.status(500).json({
            success: false,
            message: 'Error handling appointment',
        });
    }
}

async function redirectToGoogle(req, res, appointmentId) {
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }
        const URL = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
        res.redirect(URL);
    } catch (error) {
        console.error("Error redirecting to Google:", error);
        res.status(500).send("Failed to redirect to Google.");
    }
}

async function handleGoogleRedirect(req, res, code) {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.redirect("/api/v1/patient/scheduleEvent");
    } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        res.status(500).send("Failed to authenticate with Google Calendar API.");
    }
}

async function scheduleEvent(req, res, appointmentId) {
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }
        const result = await calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            conferenceDataVersion: 1,
            requestBody: {
                summary: "Doctor's Appointment",
                description: "MediMind Health Care",
                start: {
                    dateTime: moment(appointment.date + ' ' + appointment.time, 'YYYY-MM-DD HH:mm').toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                end: {
                    dateTime: moment(appointment.date + ' ' + appointment.time, 'YYYY-MM-DD HH:mm').add(30, 'minutes').toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                conferenceData: {
                    createRequest: {
                        requestId: uuid(),
                    }
                },
                attendees: [{
                    email: "medimind.web@gmail.com",
                }]
            }
        });
        res.status(200).json({
            success: true,
            msg: "Link Generated",
            link: result.data.hangoutLink,
        });
    } catch (error) {
        console.error("Error scheduling event:", error);
        res.status(500).send("Failed to schedule event.");
    }
}

module.exports = { handleAppointment, handleGoogleRedirect, scheduleEvent};


/*
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
                    email: "medimind.web@gmail.com",
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
*/