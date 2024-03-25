// Import required modules and create an Express app
const express = require("express");
const app = express();
var cors = require('cors')
app.use(cors()) // Use this after the variable declaration
// Load environment variables from .env file
require('dotenv').config();

// Set the port for the application
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended : true }));

// Enable parsing of JSON in the request body
app.use(express.json());

//Connect to the MongoDB database
require("./Config/database").connect();

// Import and use the user routes at the "/api/v1" endpoint
const userRoutes = require("./Routes/user");
app.use("/api/v1", userRoutes);

app.get('/', (req, res) => {
    res.send('Hello, this is the root path!');
  });

// Start the Express app and listen on the specified port
app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});
