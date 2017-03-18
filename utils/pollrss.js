//get rss xml and convert it into json
var mongodb =  require('./mongodb');
var scrape_economictimes =  require('./scrape_economictimes');
var Feed = require('rss-to-json');
var pollrss = function (obj,next) {
	Feed.load(obj.url, function (err, rss) {
		if(err){
			console.log(err);
			next(err);
		}else {
			//console.log(rss);
			//call mongodb
			mongodb(function (err, dbObj) {
				if (err) {
					console.log("err in connecting utils");
					next(err);
				} else {
					console.log("connected utils: " + dbObj);
					rss.publisher_name=obj.publisher_name;
					rss.time = new Date();
					rss.url = obj.url;
					mongodb.insert(dbObj, 'rssFeeds', rss);
					mongodb.read(dbObj, 'rssFeeds',{},function (err,data){
						if (err) {
							console.log(err);
						} else {
							//console.log("data rssfeeds: " + JSON.stringify(data));
							data.map(function (item) {
								//console.log("data item: " + JSON.stringify(item));
								console.log("data item: " + JSON.stringify(item.items[0].url));
								console.log("data item: " + JSON.stringify(item.publisher_name));
								switch (item.publisher_name){
									case 'economictimes' : scrape_economictimes(item.items[0].url,
										function (err,data) {
											if(err){
												console.log("err in scrapping economictimes"+err);
											}else {
												console.log(JSON.stringify(data));
											}
										}
									);
								}
							});
						}
					});
					//mongodb.update(dbObj,'pollingDetails');
					//mongodb.delete(dbObj,'pollingDetails');
					next("",rss);
				}
			});
		}
	});
};
module.exports=pollrss;