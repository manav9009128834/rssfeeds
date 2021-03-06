var express = require('express');
var router = express.Router();
var mongodb =  require('../utils/mongodb');

/* GET articles listing. */
router.get('/articles', function(req, res, next) {
  mongodb(function (err, dbObj) {
    if (err) {
      console.log("err in connecting db");
      res.send('respond with a resource: '+err);
    } else {
      console.log("connected db: " + dbObj);
      mongodb.readarticles(dbObj, 'article','',function (err,data) {
        if (err) {
          console.log(err);
          res.send('respond with a resource: '+err);
        } else {
          console.log("data articles :" + JSON.stringify(data));
          res.json(data);
          //res.render('articles', { data: data, title : 'Articles list'});
        }
      });
    }
  });
});

/* GET articles search. */
router.get('/search', function(req, res, next) {
  mongodb(function (err, dbObj) {
    if (err) {
      console.log("err in connecting db");
      res.send('respond with a resource: '+err);
    } else {
      console.log("connected db: " + dbObj);
      var q = req.query.q;
      console.log("q : " + q);
      mongodb.readarticles(dbObj, 'article',{$text:{$search:q}},function (err,data) {
        if (err) {
          console.log(err);
          res.send('respond with a resource: '+err);
        } else {
          console.log("data articles :" + JSON.stringify(data));
          res.json(data);
          //res.render('articles', { data: data, title : 'Articles list'});
        }
      });
    }
  });
});

module.exports = router;
