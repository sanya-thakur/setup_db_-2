const express = require('express');
const { resolve } = require('path');
require('dotenv').config();
const app = express();
const port = 3010;
const mongoose=require('mongoose');

app.use(express.static('static'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

mongoose.connect(process.env.MONGO_URI).then(()=>console.log('Database Connected to database')).catch((err)=>console.log("Error connecting to databse"));

const userSchema= new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Validation error: All fields are required." });
  }
  const newUser = new User({ name, email, password });

  newUser.save()
    .then(() => res.status(201).json({ message: "User created successfully" }))
    .catch(err => res.status(500).json({ message: "Server error. Could not save user. Error: ", err }));
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
