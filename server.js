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

app.post('/api/shorturl/new',function(req,res){
    const baseUrl = 'https://url-shortener-ns.herokuapp.com';
    let givenUrl = req.body;
    //console.log(req.body.url);
    let pass = req.body.url;
    //console.log(pass);

    let result = checkIt(pass);
    //console.log(result);
    //if url is valid then put it in thedatabase


    if(result){
        let newUrl = baseUrl+'/api/shorturl/new/'+shortUrl();
        //console.log('newurl'+newUrl);
        const newFull =newUrl;
        const url = new Url({
            url:pass,
            short:newFull
        });

        url.save(function (err) {
            if (err) return res.send(`it's not a valid url, please try another`);
            else(res.send({original_url: pass,shortened_url:newFull}));
        });
        let docSave='';
        setTimeout(function()
        {
            Url
                .find({
                    short: newFull   // search query
                })
                .then(doc => {
                    docSave=doc[0].url;
                    console.log(docSave);
                })
                .catch(err => {
                    console.error(err)
                })
        },3000);
        function handleRedirect(rec,res) {
            res.redirect(docSave);
        }
        app.get(newFull,handleRedirect);
    }
    else res.send(`it's not a valid url, please try another`);
});

//app listening on function
app.listen(port, function () {
    console.log('Node.js listening ...');
});