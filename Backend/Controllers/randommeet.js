import  express  from "express";
import {google} from "googleapis";
import axios from "axios";
import dayjs from "dayjs";
import {v4 as uuid} from "uuid";
const app = express();

const PORT = 8000;

const calendar = google.calendar({
    version:"v3",
    auth:"AIzaSyAP3XDcxV3PJM6RFwAriZ63POcy5K8IjIE"
});
const oauth2Client = new google.auth.OAuth2(
    "976403191613-mth034ign9t4tskbu3na420cl8cbdap1.apps.googleusercontent.com",
    "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",
    "http://localhost:8000/google/redirect"
  );

  const scopes = [
    'https://www.googleapis.com/auth/calendar'
  ];

app.get("/google",(req,res)=>{
    const URL = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
      
        // If you only need one scope you can pass it as a string
        scope: scopes
      });

      res.redirect(URL);
});

app.get("/google/redirect", async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.send("Authentication successful. You can now access Google Calendar API.");
    } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        res.status(500).send("Failed to authenticate with Google Calendar API.");
    }
});


app.get("/schedule",async(req,res)=>{
    const result = await calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        conferenceDataVersion:1,
        requestBody :{
            summary :"test event",
            description : "OKAY ",
            start :{
                dateTime : dayjs(new Date()).add(1,'day').toISOString(),
                timeZone : "Asia/Kolkata",
            },
            end :{
                dateTime : dayjs(new Date()).add(1,'day').add(1,'hour').toISOString(),
                timeZone : "Asia/Kolkata",
            },
            conferenceData:{
                createRequest: {
                    requestId:uuid(),
                }
            },
            attendees:[{
                email:"jaickeyj@iitbhilai.ac.in",
            }]
        }
        // resource: event,
      });
      console.log("Schedule");
      console.log(result);
      res.send({
        msg:"DONE"
      })
    });

app.listen(PORT,()=>{
    console.log("Server",PORT);
});