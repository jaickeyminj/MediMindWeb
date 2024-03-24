const express = require('express');
const googleMeet = require("google-meet");

const app = express();

exports.meet = async (req, res) => {
    const meeting = await googleMeet.createMeeting();

  // Get the meeting link.
    const meetingLink = meeting.link;
    console.log(meetingLink);
  // Send the meeting link to the client.
//   res.send(meetingLink);
    return res.status(200).json({
        success: true,
        message: 'meet'+ meetingLink,
    });
}