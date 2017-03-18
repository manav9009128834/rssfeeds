var scrape_economictimes = function(eachfeed,next) {
	var request = require('request');
	var cheerio = require('cheerio');
	request(eachfeed.url, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			var articleObj = {};
			//console.log("html economictimes: "+html);
			articleObj.title = $('h1.title').text();
			console.log("title: "+articleObj.title);

			articleObj.description = eachfeed.description;
			console.log("description: "+articleObj.description);

			articleObj.rssfeedId = eachfeed.rssfeedId;
			console.log("rssfeedId: "+articleObj.rssfeedId);

			articleObj.pollingId = eachfeed.pollingId;
			console.log("pollingId: "+articleObj.pollingId);

			articleObj.rssfeedItemIndex = eachfeed.rssfeedItemIndex;
			console.log("rssfeedItemIndex: "+articleObj.rssfeedItemIndex);

			articleObj.main_image = $('.articleImg figure img').attr("src");
			console.log("main_image: "+articleObj.main_image);

			articleObj.content_text = $('.artText .section1 .Normal').text();
			console.log("content_text: "+articleObj.content_text);

			articleObj.author = $('.bylineFull .byline').text().split('|').shift();
			console.log("author: "+articleObj.author);

			articleObj.time = $('.bylineFull .byline').text().split('|').pop().split(':').pop();
			console.log("time: "+articleObj.time);

			next("",articleObj);
		}else{
			console.log("err in scrapping economictimes");
			next(error);
		}
	});
};
// scrape_economictimes('http://economictimes.indiatimes.com/news/company/corporate-trends/jio-customers-to-remain-loyal-even-with-paid-services-report/articleshow/57703541.cms',
// 	function (err,data) {
// 		if(err){
// 			console.log("err in scrapping economictimes"+err);
// 		}else {
// 			console.log(JSON.stringify(data));
// 		}
// 	}
// );
module.exports=scrape_economictimes;