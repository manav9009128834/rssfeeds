var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var feedsUrl = require('./utils/feedsUrl');
var mongodb =  require('./utils/mongodb');
var pollrss =  require('./utils/pollrss');


var index = require('./routes/index');
var users = require('./routes/users');

feedsUrl.map(function (obj) {
  console.log(obj);
  mongodb(function (err, dbObj) {
    if (err) {
      console.log("err in connecting utils");
      next(err);
    } else {
      console.log("connected utils: " + dbObj);
      var data = {};
      data.publisher_name = obj.publisher_name;
      data.time = new Date();
      data.url = obj.url;
      mongodb.insert(dbObj, 'pollingDetail', data);
    }
  });
      // pollrss(obj,function (err, data) {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log("poll rss: " + JSON.stringify(data));
      //   }
      // });


    }
);



// //call mongodb
// mongodb(function (err,dbObj){
//    if(err){
//      console.log("err in connecting utils");
//    }else {
//      console.log("connected utils: "+dbObj);
//      mongodb.insert(dbObj,'pollingDetails');
//      mongodb.read(dbObj,'pollingDetails');
//      mongodb.update(dbObj,'pollingDetails');
//      //mongodb.delete(dbObj,'pollingDetails');
//    }
// });





//cron job
// var schedule = require('node-schedule');
// var rule = new schedule.RecurrenceRule();
// rule.second = [0, 10, 20];
// //var j = schedule.scheduleJob('*/1 * * * *', function(){
// var j = schedule.scheduleJob(rule, function(){
//   console.log('The answer to life, the universe, and everything!');
// });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
