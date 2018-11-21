'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true });

app.use(cors());

var Schema = mongoose.Schema;
var urlSchema = new Schema({
  url: {type:String ,required:true},
  short: Number,
});/* = <Your Model> */

var Website = mongoose.model('Website',urlSchema);

// var a  = new Website({url:'www.here.com',short:0});
// a.save();

var bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({extended: false})
);


/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new',(req, res)=>{
  
  Website.find({url:req.body.url});
  
  res.send('some info here: '+ req.body.url);
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});