//get rss xml and convert it into json
var mongodb =  require('./mongodb');
var scrape_economictimes =  require('./scrape_economictimes');
var Feed = require('rss-to-json');
var pollrss = function (obj,pollingId,next) {
	Feed.load(obj.url, function (err, rss) {
		if(err){
			console.log(err);
			next(err);
		}else {
			//console.log(rss);
			//call mongodb
			mongodb(function (err, dbObj) {
				if (err) {
					console.log("err in connecting ");
					next(err);
				} else {
					//console.log("connected utils: " + dbObj);
					rss.publisher_name=obj.publisher_name;
					rss.time = new Date();
					rss.url = obj.url;
					rss.pollingId = pollingId;
					mongodb.insert(dbObj, 'rssFeeds', rss, function (err,result) {
						//mongodb.update(dbObj,'pollingDetails');
						//mongodb.delete(dbObj,'pollingDetails');
						result.pollingId = pollingId;
						result.status = "success";
						next("",result);
					});
				}
			});
		}
	});
};
module.exports=pollrss;