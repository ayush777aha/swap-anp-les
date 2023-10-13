const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const port = process.env.PORT || 3000;
const dbUrl = 'mongodb+srv://ayush_garg:8H81U7oJeAfy80eQ@cluster0.tzjhowc.mongodb.net/main';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
