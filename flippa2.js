var Flippa = require('./node_modules/flippa/dist/Flippa.js');
var request = require('request');
const express = require('express')
const app = express()
var revenues = [];
var profits = [];
var bins = [];
var htmls = [];
var ratios = {};
var ends_ats = [];
var reserve_mets = [];
abc = 0;

flippa = new Flippa();

app.get('/', function(req, res) {
	revenues = [];
	profits = [];
	reserve_mets = [];
	bins = [];
	htmls = [];
	ratios = {};
	ends_ats = [];
	abc = 0;
		if (!req.param('minrevenue')){
		lala2 = "<html><meta></meta><body><form action='/' method='GET'>Is BIN:<select name='has_bin'><option value='Y'>Yes</option><option value='N'>No</option></select> Maximum months ROI:<input type='text' value='24' name='maxroi'> Minimum revenue:<input type='text' value='1000' name='minrevenue'><input type='submit'></form>";
                        
		lala2+= "</body></html>";
		res.send(lala2);
	}
	else{
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
					.list({
							filter: {
								status: "open",
								has_verified_revenue: true,
								has_bin: (req.param('has_bin') == "Y") ? 'true' : 'false' 
							}
						
					}) //,has_bin: true}})
					.then(function lala(response) {
						//console.log(response.body.data[0]);
						if (response == undefined) {
							(req.param('has_bin') == "Y") ? lala2 = "<html><meta></meta><body><form action='/' method='GET'>Is BIN:<select name='has_bin'><option value='Y' selected>Yes</option><option value='N'>No</option></select> Maximum months ROI:<input type='text' value='" + req.param('maxroi') + "' name='maxroi'> Minimum revenue:<input type='text' value='" + req.param('minrevenue') + "' name='minrevenue'><input type='submit'></form>" : lala2 = "<html><meta></meta><body><form action='/' method='GET'>Is BIN:<select name='has_bin'><option value='Y'>Yes</option><option value='N' selected>No</option></select> Maximum months ROI:<input type='text' value='" + req.param('maxroi') + "' name='maxroi'> Minimum revenue:<input type='text' value='" + req.param('minrevenue') + "' name='minrevenue'><input type='submit'></form>";
							
							for (var key in ratios) {
								//console.log(key['revenues']);
								if ((ratios[key]['bins'] / ratios[key]['revenues']) <= req.param('maxroi') && key != undefined && ratios[key]['revenues'] != undefined && (ratios[key]['bins'] / ratios[key]['revenues']) != Infinity && ratios[key]['revenues'] >= req.param('minrevenue')) {
									console.log(ratios[key]['reserve_met']);
									if (ratios[key]['reserve_met'] == true){
										lala2 += ('<span style=\'color: lightgreen;\'>RESERVE MET!</span> ' + (ratios[key]['bins'] / ratios[key]['revenues']) + ' months for <a href="' + key + '">' + key + '</a> earning $' + ratios[key]['revenues'] + ' at $' + ratios[key]['bins']) + ' ending in ' + ratios[key]['diffDays'] + ' days<br>';
									}
									else {
										lala2 += ('<span>' + (ratios[key]['bins'] / ratios[key]['revenues']) + ' months for <a href="' + key + '">' + key + '</a> earning $' + ratios[key]['revenues'] + ' at $' + ratios[key]['bins']) + ' ending in ' + ratios[key]['diffDays'] + ' days</span><br>';
										
									}
								}
							}
						
							lala2 += "</body></html>";
							console.log(lala2);
							res.send(lala2);
						} else {

							if (abc >= 1) {
								//console.log(response.body);
								var result2 = (JSON.parse(response.body));
								var result = result2.data;
								getresponse(result, req.param('has_bin'), ((result2.meta)['page_number'] - 1) * (result2.meta)['page_size']);
								request((result2.links)['next'], function(error, response, body) {
									lala(response);

								})
							} else {
								var result = (response.body.data);
								getresponse(result, req.param('has_bin'), (response.body.meta['page_number'] - 1) * response.body.meta['page_size']);
								request(response.body.links.next, function(error, response, body) {
									lala(response);

								});
							}
							abc++;
						}
					})
			})
		}
})

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})


function getresponse(result, has_bin, n){
    //console.log(n);
    for (var i = 0; i < result.length + 0; i++) {
        console.log(result[i]);
        revenues[i + n] = result[i]['revenue_per_month'];
        //console.log(revenues[i + n]);
        profits[i + n] = result[i]['profit_per_month'];
		if (has_bin == "N"){
			bins[i + n] = result[i]['current_price']; //current_pricebuy_it_now_price
        }
		else {
			bins[i + n] = result[i]['buy_it_now_price']; //current_pricebuy_it_now_price

		}
		reserve_mets[i + n] = result[i]['reserve_met'];
		ends_ats[i + n] = result[i]['ends_at'];
		htmls[i + n] = result[i]['html_url'];
    }
    var i = n;
    for (var bin in bins) {
        //console.log(i);
        if (bin != undefined) {
            //console.log(bins[i]);
			var d1 = new Date();
			var d2 = new Date(ends_ats[i]);
			var timeDiff = Math.abs(d2.getTime() - d1.getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

            ratios[htmls[i]] = {
                'bins': parseFloat(bins[i]),
                'revenues': parseFloat(revenues[i]),
				'diffDays': diffDays,
				'reserve_met': reserve_mets[i]
            };
            console.log(ratios[htmls[i]]);
        }
        i++;
    }
}