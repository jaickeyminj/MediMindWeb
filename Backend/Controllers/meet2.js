const express = require("express");
const { google } = require("googleapis");
const dayjs = require("dayjs");
const Appointment = require('../Models/appointment');
const { v4: uuid } = require("uuid");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

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

/*
async function redirectToGoogle(req, res) {
    console.log("redirect");
    const URL = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(URL);
}

async function handleAppointment(req, res) {
    try {
            const appointmentId = req.body.appointmentId;
            const code = req.query.code;
            console.log("Inside hnadle appointment ");
            await redirectToGoogle(req, res, appointmentId, code);
        }
    catch (error) {
        console.error("Error handling appointment:", error);
        return res.status(500).json({
            success: false,
            message: 'Error handling appointment',
        });
    }
}


// async function redirectToGoogle(req, res, appointmentId, code) {
//     try {
//         const appointment = await Appointment.findById(appointmentId);
//         console.log("Inside Redirectgogle");
//         if (!appointment) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Appointment not found',
//             });
//         }

//         if (code) {
//             const { tokens } = await oauth2Client.getToken(code);
//             oauth2Client.setCredentials(tokens);
//             console.log("creds set");
//             await scheduleEvent(req, res, appointmentId);
//         } else {

//             const URL = oauth2Client.generateAuthUrl({
//                 access_type: 'offline',
//                 scope: scopes
//             });
//             console.log("restart creds not set");
//             console.log(URL);
//             res.redirect(URL);
//         }
//     } catch (error) {
//         console.error("Error redirecting to Google:", error);
//         res.status(500).send("Failed to redirect to Google.");
//     }
// }


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

async function scheduleEvent(req, res) {
    try {
        const appointmentId = req.body.appointmentId;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }
        console.log("Inside Schedule Appointment");
        
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

module.exports = { handleAppointment, handleGoogleRedirect, scheduleEvent,redirectToGoogle};
*/



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

        //start
        const tokensJson = JSON.stringify(tokens, null, 2);
        fs.writeFile('token.json', tokensJson, (err) => {
            if (err) {
              console.error('Error writing token to file:', err);
              return;
            }
            console.log('Token saved to token.json');
          });

            const oAuthJson = JSON.stringify(oauth2Client, null, 2);
          fs.writeFile('oAuth.json', oAuthJson, (err) => {
              if (err) {
                console.error('Error writing oAuth to file:', err);
                return;
              }
              console.log('oAuth saved to oAuth.json');
            });
        console.log(tokens);
        console.log(oauth2Client);
        



        res.redirect("/api/v1/patient/scheduleEvent");


    } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        res.status(500).send("Failed to authenticate with Google Calendar API.");
    }
}

async function scheduleEvent(req, res) {
    try {

        const appointmentId = req.body.appointmentId;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }
        console.log("Appointment found hence scheduling");
        var tokens1=null;
        var oAuths=null;
        const tokenFileName = 'token.json'; // Replace with your file name
        // E:\Computer System Design\Final Project\Web\MediMindWeb\Backend\token.json
        await fetchTokenFromCurrentDirectory(tokenFileName)
        .then(token => {
            tokens1=token;
            console.log('Token fetched:', token);
            // Use the token as needed
        })
        .catch(error => {
            console.error('Error fetching token:', error);
        });

        const oAuthFileName = 'oAuth.json'; // Replace with your file name
        // E:\Computer System Design\Final Project\Web\MediMindWeb\Backend\token.json
        await fetchTokenFromCurrentDirectory(oAuthFileName)
        .then(token => {
            oAuths = token;
            // tokens=token;
            console.log('Token fetched:', token);
            // Use the token as needed
        })
        .catch(error => {
            console.error('Error fetching token:', error);
        });
        const calendar1 = google.calendar({
            version: "v3",
            auth: "AIzaSyD-WcnVeN8ZpdPFdx43GX-smyWk-pSEYao"
        });
        
        const oauth2Client1 = new google.auth.OAuth2(
            "695738836432-q6e95lmhsof2eteblf9m9i1pmg0f5kcm.apps.googleusercontent.com",
            "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",
            "http://localhost:27017/api/v1/patient/handleGoogleRedirect"
        );
        
        const scopes1 = [
            'https://www.googleapis.com/auth/calendar'
        ];

        try{
            console.log("setting token");
            oauth2Client1.setCredentials(tokens1);
            console.log("token set");
        }catch (error) {
            console.error("Error exchanging code for tokens from the files :", error);
            res.status(500).send("Failed to authenticate with Google Calendar API. (Files)");
        }

        const result = await calendar.events.insert({
            auth: oauth2Client1,
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
        // const appointmentId = req.body.appointmentId;
            // const appointment = await Appointment.findById(appointmentId);

            if (appointment) {
                appointment.meetingLink = result.data.hangoutLink;
                await appointment.save();
            }
            console.log(appointment);
            console.log(result.data.hangoutLink);
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

async function fetchTokenFromCurrentDirectory(fileName) {
    const filePath = path.join(__dirname, '..', fileName);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const token = JSON.parse(data);
          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

exports.redirectToGoogle = redirectToGoogle;
exports.handleGoogleRedirect = handleGoogleRedirect;
exports.scheduleEvent = scheduleEvent;
