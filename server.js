'use strict';
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect('mongodb://mit_user:(Abg19580824@ds259111.mlab.com:59111/url_shortener');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to database')
});
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
let bodyP = bodyParser.urlencoded({extended: false});
app.use(bodyP);
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function(req, res){
    res.sendFile(process.cwd() + '/views/index.html');
});

let Schema = mongoose.Schema;
let urlSchema = new mongoose.Schema({
    url: String

});
module.exports = mongoose.model('peld',urlSchema);
let url = mongoose.model('url', urlSchema);
//db is prepared to receive a valid url
//-------------------------------------------------------------

app.post('/api/shorturl/new',function(req,res){
    let givenUrl = req.body;
    console.log(req.body.url);
    let pass = req.body.url;
    console.log(pass);

    let result = check(pass);
    console.log(result);
    //if url is valid then put it in thedatabase
    if(result){
        console.log(result);
        let url1 = new url(givenUrl);
        url1.save(function (err) {
            if (err) return res.send(`it's not a valid url, please try another`);
            else(res.send('saved'));
        });
    }
    else res.send(`it's not a valid url, please try another`);
});


//shortener function
let shortenUrl = function(pass) {
    // set url length limit
    let random = Math.floor(Math.random()*10000);
    console.log(random);
    //let new Url= 'http://api/shortUrl
};

//url validation function
function check(pass){
    let result = new RegExp("(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
    return result.test(pass);
}
//app listening on function
app.listen(port, function () {
    console.log('Node.js listening ...');
});

