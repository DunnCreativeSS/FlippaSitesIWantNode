var Flippa = require('./node_modules/flippa/dist/Flippa.js');
var request = require('request');
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  	res.header('Content-Type', 'text/html');

	flippa
  .authenticate({
    grant_type: "password",
    username: "yourflippaemail",
    password: "yourflippapassword"
  })
  .then(function(response) {
    // Authentication succeeded; can now make authorized requests.
   // console.log(flippa.client.accessToken);
	flippa
  .listings
  .list({filter: {status: "open", has_verified_revenue: true}})//,has_bin: true}})
  .then(function lala (response) {
    //console.log(response.body.data[0]);
	if (response == undefined){
		lala2 = "<html><meta></meta><body>";
		for (var key in ratios){
		//console.log(key['revenues']);
		if (key != undefined && ratios[key]['revenues'] != undefined && (ratios[key]['bins'] / ratios[key]['revenues']) != Infinity && ratios[key]['revenues'] >= 1000){
		lala2+=((ratios[key]['bins'] / ratios[key]['revenues']) + ' months for <a href="' + key + '">'+key+'</a> earning $' + ratios[key]['revenues'] + ' at $' + ratios[key]['bins']) + '<br>' ;
		}
	}
	lala2+="</body></html>";
	console.log(lala2);
	res.send(lala2);
	}
	else{
		
	if (abc >= 1){
	//console.log(response.body);
	var result2 = (JSON.parse(response.body));
	var result = result2.data;
			getresponse(result,((result2.meta)['page_number'] - 1) * (result2.meta)['page_size'] );
			request((result2.links)['next'], function (error, response, body) {
				lala(response);
			
		}) 	
	}
	else {
		var result = (response.body.data);
			getresponse(result,(response.body.meta['page_number'] - 1) * response.body.meta['page_size'] );
			request(response.body.links.next, function (error, response, body) {
				lala(response);
			
		});	 	
	}
	abc++;
	}
  })
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var revenues = [];
	var profits = [];
	var bins = [];
	var htmls = [];
	var ratios = {};
abc = 0;
	flippa = new Flippa();
function sortNumber(a,b) {
   return a - b;
}
	function getresponse(result, n){
	//console.log(n);
	for (var i = 0; i < result.length + 0; i++) { 
		//console.log(result[i]);
		revenues[i + n] = result[i]['revenue_per_month'];
		//console.log(revenues[i + n]);
		profits[i + n] = result[i]['profit_per_month'];
		bins[i + n] = result[i]['current_price'];//current_pricebuy_it_now_price
		htmls[i + n] = result[i]['html_url'];
	}
	var i = n;
	for (var bin in bins) {
		//console.log(i);
		if (bin != undefined){
		//console.log(bins[i]);
		ratios[htmls[i]] = {'bins': parseFloat(bins[i]), 'revenues': parseFloat(revenues[i])};
		//console.log(ratios[i]);
		}		
		i++;
	}	
	}

 