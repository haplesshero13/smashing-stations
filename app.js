var express = require('express');
var request = require('request');
var sass    = require('node-sass-middleware');
var app = express();

app.set('view engine', 'jade');
app.use(
  sass({
     src: __dirname + '/stylesheets',
     dest: __dirname + '/public/stylesheets',
     prefix:  '/stylesheets',
     debug: true,
   })
);
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

app.get('/:id', function (req, res) {
  res.render('index', { title: 'Smashing Stations', bracketID: req.params.id });
});

app.get('/brackets/:id', function (req, res) {
  var endpoint = "https://api.smash.gg/phase_group/" + req.params.id + "?expand%5B%5D=sets&expand%5B%5D=seeds&expand%5B%5D=entrants";
  request(endpoint, function(error, response, body) {
    res.json(JSON.parse(body));
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on localhost:'+ port);
