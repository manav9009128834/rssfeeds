var mongoDbObj;
var mongoClient=require('mongodb').MongoClient;
var mongodb = function (next) {
	//mongoClient.connect('mongodb://localhost/rssfeedsDb', function(err, db){
	mongoClient.connect('mongodb://manav:123456@ds135690.mlab.com:35690/rssfeeds', function(err, db){
				if(err) {
					console.log(err);
					next(err);
				}else{
					console.log("Connected to MongoDB");
					//mongoDbObj={db: db,	pollingDetails: db.collection('pollingDetails')};
					next("",db);

				}
		});
	};

mongodb.insert = function (db,collection,obj,next) {
	mongoDbObj={db: db,	collection: db.collection(collection)};
	mongoDbObj.collection.insert(obj,function(err, result){
		if(err){
			//Handle the failure case
			console.log(err);
			next(err);
		}
		else{
			//Handle the success case
			//console.log("success: "+JSON.stringify(result));
			next("",result);
		}
	});
};
mongodb.read = function (db,collection,query,next) {
	mongoDbObj={db: db,	collection: db.collection(collection)};
	mongoDbObj.collection.find(query).toArray(function(err, data){
	if(err) {
		console.log(err);
		next(err);
	}else{
		console.log("data: from "+collection+" :"+JSON.stringify(data));
		next("",data);
		}
	});
};

mongodb.readarticles = function (db,collection,query,next) {
	mongoDbObj={db: db,	collection: db.collection(collection)};
	mongoDbObj.collection.find().limit(1).toArray(function(err, data){
		if(err) {
			console.log(err);
			next(err);
		}else{
			console.log("data: from "+collection+" :"+JSON.stringify(data));
			next("",data);
		}
	});
};

mongodb.update = function (db,collection,data,cbk) {
	mongoDbObj={db: db,	collection: db.collection(collection)};
	mongoDbObj.collection.update({_id:"58cc364d2176671abbd882d8"},{$set: {name:"Ravi Kiran"}},{w:1}, function(err, result){
		if(err) {
			console.log(err);
			cbk(err);
		}else{
			console.log("result: "+JSON.stringify(result));
			cbk("",result);
		}
	});
};


mongodb.updatepollingDetail = function (db,collection,data,cbk) {
	mongoDbObj={db: db,	collection: db.collection(collection)};
	var status = data.status == "success" ? "success" : "fail";
	mongoDbObj.collection.update({_id:data.pollingId},{$set: {status:status}},{w:1}, function(err, result){
		if(err) {
			console.log(err);
			cbk(err);
		}else{
			console.log("updatepollingDetail result: "+JSON.stringify(result));
			result.pollingId = data.pollingId;
			cbk("",result);
		}
	});
};

mongodb.delete = function (db,collection) {
	mongoDbObj={db: db,	collection: db.collection(collection)};
	mongoDbObj.collection.remove(function(err, result){
			if(err) {
			console.log(err);
		}else{
			console.log("result: "+JSON.stringify(result));
		}
	});
};


module.exports=mongodb;