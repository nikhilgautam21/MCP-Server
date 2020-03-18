const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const complaint = require('./routes/complaint');
const auth = require('./routes/auth')
const jwt = require('jsonwebtoken');
const secret = require('./config/jwt.json')
const dbconfig = require('./config/db.json')

const app = express();

app.set('Secret', secret.secretkey);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.port || "5000";
let mongooseOptions = {
  useNewUrlParser: true, 
  useUnifiedTopology: true
}
mongoose.connect(dbconfig.mongodb_connection_string, mongooseOptions);
mongoose.Promise = global.Promise;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Method', 'DELETE, GET, POST, OPTIONS, PUT');
  next();
});

app.use('/api/complaint', complaint);
app.use('/auth', auth)

app.listen(port);
console.log("Server Listening at port " + port);


