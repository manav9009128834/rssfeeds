var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var feedsUrl = require('./utils/feedsUrl'); // feeds array of objects
var mongodb =  require('./utils/mongodb');
var pollrss =  require('./utils/pollrss');
var scrape_economictimes =  require('./utils/scrape_economictimes');
var index = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');
var api = require('./routes/api');
var search = require('./routes/search');

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
app.use('/articles', articles);
app.use('/api/v1', api);
app.use('/search', search);

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

/*
// iterate all feed urls
feedsUrl.map(function (obj) {
  console.log(obj);
  mongodb(function (err, dbObj) {
    if (err) {
      console.log("err in connecting utils");
    } else {
      console.log("connected utils: " + dbObj);
      var data = {};
      data.publisher_name = obj.publisher_name;
      data.time = new Date();
      data.url = obj.url;
      //insert into polling detail
      mongodb.insert(dbObj, 'pollingDetail', data, function (err, result) {
        if (err) {
          console.log("pollingDetail not inserted");
        } else {
          console.log("pollingDetail inserted data: " + JSON.stringify(result.ops[0]._id));
          var pollingId = result.ops[0]._id;
          // get rss feed and insert that rss into rssfeed collection
          pollrss(obj,pollingId,function (err, data) {
            //if error in getting rss feed
            if (err) {
              console.log(err);
              // update polling detail status : failed
              data.status = "fail";
              mongodb.updatepollingDetail(dbObj,'pollingDetail',data,function (err,result) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("update pollingDetail: " + JSON.stringify(result));
                }
              });
            } else {
              //if rssfeed inserted successfully
              console.log("poll rss: " + JSON.stringify(data));
              // update polling detail status : success
              mongodb.updatepollingDetail(dbObj,'pollingDetail',data,function (err,result) {
                if(err){
                  console.log(err);
                } else {
                  console.log("update pollingDetail: " + JSON.stringify(result));
                  // if polling detail updated success, then read rss and then scrape one by one link
                  mongodb.read(dbObj, 'rssFeeds',{pollingId:result.pollingId},function (err,data){
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("data rssfeeds: " +result.pollingId+" :"+ JSON.stringify(data));
                      //iterate rssfeed items of this pollingId
                      data.map(function (item) {
                        //console.log("data item: " + JSON.stringify(item));
                        //console.log("rssfeed data url: " + JSON.stringify(item.items[0].url));
                        //console.log("rssfeed data publisher_name: " + JSON.stringify(item.publisher_name));
                        item.items.map(function (eachfeed) {
                          eachfeed.pollingId = result.pollingId;
                          eachfeed.rssfeedId = item._id;
                          eachfeed.rssfeedItemIndex = arguments[1];
                          console.log("rss feed index:"+arguments[1]);
                          //console.log("eachfeed url: " + JSON.stringify(eachfeed.url));
                          switch (item.publisher_name){
                            case 'economictimes' : scrape_economictimes(eachfeed, function (err,data) {
                                  if(err){
                                    console.log("err in scrapping economictimes"+err);
                                  }else {
                                    console.log(JSON.stringify(data));
                                    //insert into articles collection
                                    mongodb.insert(dbObj, 'article', data, function (err, result) {
                                      if (err) {
                                        console.log("article not inserted");
                                      } else {
                                        console.log("article inserted data: " + JSON.stringify(result.ops[0]._id));
                                      }
                                    });
                                  }
                                });
                                break;
                            default : console.log("switch default");
                          }
                        });

                      });
                    }
                  });
                }
              });
            }
          });
        }
      });

    }
  });
    }
);
*/



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



module.exports = app;
