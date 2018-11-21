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
  console.log(req.body.url);
  var url = req.body.url;
  
  var createNewUrl = function(url){
    
    Website.find({url:true},(err,data)=>{
      
      if(err)console.log("Error: ",err);
      
      var site = new Website({url:url,short:data.length});
      site.save((err,data)=>{err?console.log(err):console.log(data)});
    });
  }
  createNewUrl();
  
  res.send({'original_url':req.body.url,short_url:'stub'});
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});