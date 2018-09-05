'use strict';

const checkIt= require('./regex.js');
const shortUrl = require('./shortener.js');
const nodemon = require('nodemon');
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
require('dotenv').config();
const key = process.env.MLAB_URI;
//console.log(key);
//mongoose
mongoose.connect(key)
    .then(()=>console.log('Connected to the mongo database'))
    .catch(err => console.error('could not connect to mongo db',err));
/*const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to database')
});*/
app.use(cors());

let bodyP = bodyParser.urlencoded({extended: false});
app.use(bodyP);
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function(req, res){
    res.sendFile(process.cwd() + '/views/index.html');
});

let Schema = mongoose.Schema;
const urlSchema = new mongoose.Schema({
    url: String,
    short: String,
    date : { type: Date, default: Date.now }
});
//module.exports = mongoose.model('peld',urlSchema);
const Url = mongoose.model('Url', urlSchema);
//db is prepared to receive a valid url
//-------------------------------------------------------------
function itIsNotThereYet(newUrl,pass,res){
    console.log('itt vagyunk');
    const newFull = newUrl;
    const url = new Url({
        url: pass,
        short: newFull
    });

    url.save(function (err) {
        if (err) return res.send(`it's not a valid url, please try another`);
        else (res.send({original_url: pass, shortened_url: newFull}));
    });

}
app.post('/api/shorturl/new',function(req,res){
    const baseUrl = 'https://url-shortener-ns.herokuapp.com';
    let givenUrl = req.body;
    let pass = req.body.url;
    console.log(pass);
    let result = checkIt(pass);
    if(result) {
        let newUrl = '/api/shorturl/new/' + shortUrl();
        //console.log('newurl'+newUrl);
        Url.find({url: pass}).exec(callback);
        function callback(err,doc){

            if (doc[0]==undefined){
                itIsNotThereYet(newUrl,pass,res);
            }
            else{
                res.send(doc[0]);
            }
        }
    }
    else res.send(`it's not a valid url, please try another one`);
});


app.get('/api/shorturl/new/:number',function(req,res){
    let number = req.params.number;
    console.log(number);
    let notDigit = /[^0-9]/g;
    let result = notDigit.test(number);
    if(result){
        res.send('it is a url not in the correct format: /api/shorturl/new/number...the number part can contain only numbers');
    }
    else{
        let docSave='';
        let fullUrl = '/api/shorturl/new/'+number;
        setTimeout(function()
        {
            let result = Url
                .find({
                    short: fullUrl   // search query
                })
                .then(doc => {
                    docSave=doc[0].url;
                    res.redirect(docSave);
                })
                .catch(err => {
                    res.send('there is no url to be found in the database with this number, please try another one');
                })
        },3000);
    }

});


//app listening on function
app.listen(port, function () {
    console.log('Node.js listening on port...'+port);
});