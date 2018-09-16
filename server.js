const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cron = require('node-cron');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const postsController = require('./controllers/posts-controller');
//const routes = require('./routes/routes');

mongoose.connect('mongodb+srv://claudio:'
                    + process.env.PRIVATE_KEY + 
                        '@cluster0-lhxzj.gcp.mongodb.net/test?retryWrites=true', {
                            useNewUrlParser: true
                        })
        .then(db => console.log("DB connected"))
        .catch(err => console.log(err, process.env.MONGO_PW));

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/posts', routes);

cron.schedule("* * * * *", () => {
    postsController.everyHour();
});

postsController.everyHour();

//declare port
var port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
 port = process.env.PORT;
}

//run app on port
app.listen(port, () => {
 console.log('app running on port: %d', port);
});