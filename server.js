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

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({extended: false})
);

app.use('/public', express.static(process.cwd() + '/public'));

var p = (val)=>{console.log(val)}

//Accessing short urls
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


//Creating short urls
app.post('/api/shorturl/new',(req, res)=>{
  //check for existing entry
  Website.find({url:req.body.url},(e,d)=>{
    if(e)p(e);
    //If no entry,
    if(d.length==0 && d.short!==0){
      //add new entry
      //get collection size
      Website.countDocuments((e,d)=>{
        if(e)p(e);
        p(d,process.cwd());
        var urlNumber = d;
        let newSite = Website({url:req.body.url,short:urlNumber});
        newSite.save((e,d)=>{
          if(e)p(e);
          res.json('some info here: '+ req.body.url+', '+urlNumber);
          return p(d);
          
        });
      });
    }
    //If entry exists
    else{
      return p(d);
    }
  });
})

app.get('/api/shorturl/:short',(req,res)=>{
  Website.find({short:req.params.short},(e,d)=>{
    if(e)p(e);
    else{
      if(d.length==0)res.json({error:'invalid URL'});
      else{
        p(d);
        return res.redirect(d.url);
      }
    }
  });
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});