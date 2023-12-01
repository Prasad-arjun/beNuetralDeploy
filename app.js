require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3005;

// Connect to MongoDB Atlas
mongoose
  .connect("mongodb+srv://arjunprasad2736:thinkvision2736@carboncalculator.f301tbq.mongodb.net/beNuetral?retryWrites=true&w=majority")
  .then((e) => console.log("MongoDB connected"));

// Define a schema for the user data
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Create a model for the user data
const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(
    `Login request received for username: ${username} and password: ${password}`
  );
  // Find the user with the given username and password
  const user = await User.findOne({ username, password });
  if (user) {
    res.send("Login successful!");
  } else {
    res.send("Invalid username or password!");
  }
});

app.post("/create-account", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  console.log(
    `Create account request received for username: ${username}, email: ${email}, password: ${password}, and confirmPassword: ${confirmPassword}`
  );
  // Check if the passwords match
  if (password !== confirmPassword) {
    res.send("Passwords do not match!");
    return;
  }
  // Create a new user with the given data
  const user = new User({ username, email, password });
  try {
    // Save the user to the database
    await user.save();
    res.send("Account created successfully!");
  } catch (error) {
    console.error(error);
    res.send("Error creating account!");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
