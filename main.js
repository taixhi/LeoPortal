var pug = require("pug")
var AWS = require("aws-sdk");
var express = require('express')
var app = express()
var userID
var Bing = require('node-bing-api')({ accKey: "603721242b254b3da9bb369d2da6e25c" });

// Web App
app.set('view engine', 'pug')
app.get('/', function (req, res) {
  res.sendFile('index.html', {root: __dirname })
})
app.get('/preview', function (req, res) {
  res.sendFile('preview.html', {root: __dirname })
})
app.get('/test_pug', function (req, res) {
	res.render('results', {title: 'Hey', info: 'Hello there!', img_url: "img/leaf.jpg" })
})
app.use(express.static('public'));
app.get('/results', function (req, res) {
	console.log('userID: ' + req.query['userID']);
	userID = req.query['userID'];
	AWS.config.update({
	    region: "ap-southeast-1"
	});


	var docClient = new AWS.DynamoDB.DocumentClient()

	var table = "leo";

	var params = {
    TableName: table,
    Key:{
        "userID": userID
    }
	};
	docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
    		var item = data.Item
        // console.log(JSON.stringify(entries, null, 2))
        for (i in item.entries)
				{
				  console.log("Here is the info for ", i,  " entry: ", JSON.stringify(item.entries[i].bib, null, 2))

				  // console.log("Here is the info for ", i,  " entry: ", JSON.stringify(item.entries[i].info, null, 2))
				}
				var entry1 = 21343214
				var entry2 = 87098787
				var rres = []
					Bing.web(JSON.stringify(item.entries[entry1].title).replace(/\"/g, ""), {
					    top: 10,  // Number of results (max 50) 
					    skip: 1   // kip first 3 results 
					}, function(error, res, body){
					 	rres[0] = body.webPages.value[0].displayUrl
          	rres[1] = body.webPages.value[1].displayUrl
          	rres[2] = body.webPages.value[2].displayUrl
          	rres[3] = body.webPages.value[3].displayUrl


				 		console.log(body.webPages.value[0].displayUrl)
				    // body has more useful information besides web pages 
				    // (image search, related search, news, videos) 
				    // but for this example we are just 
				    // printing the first two web page results 
				    // console.log(body.webPages.value[0].displayUrl);
				    // console.log(body.webPages.value[1].displayUrl);
				    complete()
				  });
				  console.log("BIB!!", item.entries[entry1].bib)
				function complete() {
								  	 console.log("IMG URL", JSON.stringify(item.entries[entry1].img).replace(/\"/g, ""))

					 res.render('results', {
			  	 relatedResources: rres,
			  	 array: item.entries[entry1].bib,
			     imgurl: JSON.stringify(item.entries[entry1].img).replace(/\"/g, ""),
			     title: JSON.stringify(item.entries[entry1].title).replace(/\"/g, ""),
			     info: JSON.stringify(item.entries[entry1].info).replace(/\"/g, ""),
			 		 // array2: item.entries[entry2].bib,
			    //  imgurl2: JSON.stringify(item.entries[entry2].img).replace(/\"/g, ""),
			    //  title2: JSON.stringify(item.entries[entry2].title),
			    //  info2: JSON.stringify(item.entries[entry2].info) 
			   })
					}	

        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }
	});
})

app.listen(3000, function () {
  console.log('Leo is listening on port 3000!')
})