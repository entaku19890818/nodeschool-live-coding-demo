const express = require('express');
const app = express();
const axios = require('axios');
const qs = require('querystring');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const API_GIFMAGAZINE_DOMAIN = 'http://api.gifmagazine.net';
const API_GIFMAGAZINE_PATH = '/v1/gifs/search';

const API_URL = 'https://api.sportradar.us/soccer-t3/eu/en/schedules/2017-04-01/schedule.json?api_key=n387hsw9p7r8v59pkc85vkmy';
const TEMPLATE = fs.readFileSync(path.join(__dirname, 'template', 'main.tmpl'));
const compiled = _.template(TEMPLATE);

const PORT = process.env.PORT || 3000;

// serve static files
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  const q = qs.stringify(req.query);
  const url = API_URL;
/*
axios.get(url).then((results) => {
	const data = results.sport_events;
	const images = data.map((d) => `<li>${d.id}</li>`);
	res.send(compiled({images: images}));
}).catch(next);
*/
	axios.get(url)
	  .then(function (results) {
			const data = results.data.sport_events;
			const games = data.map(function(x){

				var teams = x.competitors.map(function(y){
					return `<ui>${y.name}</ui>`;
				});
				return `<li class='list-group-item'><ui>${x.scheduled}</ui><ui>${x.season.name}</ui>` + teams + '</li>';
			});
	    console.log(games);
			res.send(compiled({games: games}));
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
