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
var uniques = [];
flippa = new Flippa();

app.get('/', function(req, res) {
	uniques = [];
	revenues = [];
	profits = [];
	reserve_mets = [];
	bins = [];
	htmls = [];
	ratios = {};
	ends_ats = [];
	if (!req.param('minrevenue')){
		lala2 = "<html><meta></meta><body><form action='/' method='GET'>Is BIN:<select name='has_bin'><option value='Y'>Yes</option><option value='N'>No</option></select> Maximum months ROI:<input type='text' value='24' name='maxroi'> Minimum revenue:<input type='text' value='1000' name='minrevenue'> Uniques/mo: <input type='text' value='95000' name='uniques'><input type='submit'></form>";
                        
		lala2+= "</body></html>";
		res.send(lala2);
	}
	else{
		res.header('Content-Type', 'text/html');
		uri = 'https://api.flippa.com/v3/listings?filter[status]=open&'
								+'filter[revenue_per_month][min]=' + req.param('minrevenue')
								
								+'&filter[has_verified_traffic]=T&'
								+'filter[uniques_per_month][min]=' + req.param('uniques')
								+'&filter[has_bin]=';
							
		(req.param('has_bin') == "Y") ? uri += 'T' :  uri+= 'F';
		(req.param('minrevenue') == "0") ? uri += "" : "&filter[has_verified_revenue]=T"
		console.log(uri);
		url = encodeURI(uri);
		flippa
			.authenticate({
				grant_type: "password",
				username: "yourflippaemail",
				password: "yourflippapassword"
			})
			.then(function(response) {
				request(url,  function(error, response, body) {
					console.log(error);
					lala(error, response, body, req, res);

				})
			})
		}
})
function lala(error,response,body,req,res){
	if (response == undefined) {
		(req.param('has_bin') == "Y") ? lala2 = "<html><meta></meta><body><form action='/' method='GET'>Is BIN:<select name='has_bin'><option value='Y' selected>Yes</option><option value='N'>No</option></select> Maximum months ROI:<input type='text' value='" + req.param('maxroi') + "' name='maxroi'> Minimum revenue:<input type='text' value='" + req.param('minrevenue') + "' name='minrevenue'> Uniques/mo: <input type='text' value='" + req.param('uniques') + "' name='uniques'><input type='submit'></form>" : lala2 = "<html><meta></meta><body><form action='/' method='GET'>Is BIN:<select name='has_bin'><option value='Y'>Yes</option><option value='N' selected>No</option></select> Maximum months ROI:<input type='text' value='" + req.param('maxroi') + "' name='maxroi'> Minimum revenue:<input type='text' value='" + req.param('minrevenue') + "' name='minrevenue'> Uniques/mo: <input type='text' value='" + req.param('uniques') + "' name='uniques'><input type='submit'></form>";
		arr = [];
		for (var key in ratios){
			arr.push(ratios[key]);
		}
		arr.sort(function(a, b){
			var keyA = new Date(a.ends_at),
				keyB = new Date(b.ends_at);
			if(keyA < keyB) return -1;
			if(keyA > keyB) return 1;
			return 0;
		});
		ratios = arr;
		alreadySkipped = false;
		
		for (var key = 0; key < ratios.length; key++) {
			rev0 = false;
			if (ratios[key]['revenues'] == '0'){
				rev0 = true;
			}
			if (rev0 == false){
				if ((ratios[key]['bins'] / ratios[key]['revenues']) <= req.param('maxroi')){
					if (key != undefined && (ratios[key]['bins'] / ratios[key]['revenues']) != Infinity && ratios[key]['revenues'] >= req.param('minrevenue')) {
						if ((parseFloat(ratios[key]['uniques']) / parseFloat(ratios[key]['revenues'])) > 400) {
							hiddenGem = true;
						}
						else{
							hiddenGem = false;
						}
						if (ratios[key]['diffDays'] >= 8 && alreadySkipped == false){
							alreadySkipped = true;
							lala2 += "<br><br>";
						}
						if (hiddenGem == true){
							lala2 += "HIDDEN GEM uniques p. dollar earned = " + Math.round(parseFloat(ratios[key]['uniques']) / parseFloat(ratios[key]['revenues'])) + "; ";
						}
						if (ratios[key]['reserve_met'] == true){
							lala2 += ('<span style=\'color: lightgreen;\'>RESERVE MET!</span> ' + Math.round(100*(ratios[key]['bins'] / ratios[key]['revenues']))/100 + ' months for <a href="' + ratios[key]['html'] + '">' + ratios[key]['html'] + '</a> earning $' + ratios[key]['revenues'] + ' at $' + ratios[key]['bins']) + ' ending in ' + ratios[key]['diffDays'] + ' days, uniques: ' + ratios[key]['uniques'] + '<br>';
						}
						else {
							lala2 += ('<span>' + Math.round(100*(ratios[key]['bins'] / ratios[key]['revenues']))/100 + ' months for <a href="' + ratios[key]['html'] + '">' + ratios[key]['html'] + '</a> earning $' + ratios[key]['revenues'] + ' at $' + ratios[key]['bins']) + ' ending in ' + ratios[key]['diffDays'] + ' days, uniques: ' + ratios[key]['uniques'] + '</span><br>';		
						}
					}
				}
			}else{
				if ((parseFloat(ratios[key]['uniques']) / parseFloat(ratios[key]['revenues'])) > 400) {
					hiddenGem = true;
				}
				else{
					hiddenGem = false;
				}
				if (ratios[key]['diffDays'] >= 8 && alreadySkipped == false){
					alreadySkipped = true;
					lala2 += "<br><br>";
				}
				if (hiddenGem == true){
					lala2 += "HIDDEN GEM uniques p. dollar earned = " + Math.round(parseFloat(ratios[key]['uniques']) / parseFloat(ratios[key]['revenues'])) + "; ";
				}
				if (ratios[key]['reserve_met'] == true){
					lala2 += ('<span style=\'color: lightgreen;\'>RESERVE MET!</span> ' + Math.round(100*(ratios[key]['bins'] / ratios[key]['revenues']))/100 + ' months for <a href="' + ratios[key]['html'] + '">' + ratios[key]['html'] + '</a> earning $' + ratios[key]['revenues'] + ' at $' + ratios[key]['bins']) + ' ending in ' + ratios[key]['diffDays'] + ' days, uniques: ' + ratios[key]['uniques'] + '<br>';
				}
				else {
					lala2 += ('<span>' + Math.round(100*(ratios[key]['bins'] / ratios[key]['revenues']))/100 + ' months for <a href="' + ratios[key]['html'] + '">' + ratios[key]['html'] + '</a> earning $' + ratios[key]['revenues'] + ' at $' + ratios[key]['bins']) + ' ending in ' + ratios[key]['diffDays'] + ' days, uniques: ' + ratios[key]['uniques'] + '</span><br>';		
				}
			}
			
		}
	
		lala2 += "</body></html>";
		
		res.send(lala2);
	} else {
		//console.log(response);
		var result2 = (JSON.parse(response.body));
		var result = result2.data;
		getresponse(result, req.param('has_bin'), ((result2.meta)['page_number'] - 1) * (result2.meta)['page_size']);
		//console.log((result2.links));
		request((result2.links)['next'], function(error, response, body) {
			//console.log(error);
			//console.log(response);
			lala(error, response, body, req, res);

		})
	}
}
app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})


function getresponse(result, has_bin, n){
    for (var i = 0; i < result.length + 0; i++) {
        uniques[i + n] = result[i]['uniques_per_month'];
        revenues[i + n] = result[i]['revenue_per_month'];
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
        if (bin != undefined) {
    		var d1 = new Date();
			var d2 = new Date(ends_ats[i]);
			var timeDiff = Math.abs(d2.getTime() - d1.getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

            ratios[d2] = {
                'bins': parseFloat(bins[i]),
                'revenues': parseFloat(revenues[i]),
				'diffDays': diffDays,
				'reserve_met': reserve_mets[i],
				'html': htmls[i],
				'uniques': uniques[i],
				'ends_at': d2
            };
        }
        i++;
    }
}