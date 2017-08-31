var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/*
app.get('/', function(request, response) {
  response.render('pages/index');
});
*/
var pg = require('pg');
pg.defaults.ssl = true;
app.get('/', function(request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT number,givenname,surname from USER_DETAILS', function(err, result) {
			done();
			if(err) {
				console.error(err); response.send("Error :" + err);
			}
			else {
				response.render('pages/index', {results:result.rows});
			}	
		});
	});

//  response.render('pages/index');
});

app.get('/user/:number', (req, res) => {
	//const user = results.filter((user) => {return user.number = req.params.number;})[0];
	//console.log(user.surname);
	console.log(req.params.number);
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		var command = 'SELECT * from USER_DETAILS where number=' + req.params.number;
		console.log(command);
		client.query(command, function(err, result) {
			done();
			if(err) {
				console.error(err); resp.send("Error :" + err);
			}
			else {
				res.render('pages/user', {results:result.rows});
			}	
		});
	});
});

app.get('/wc', (req, res) => {
	//res.send('Name :' + req.query['name'] + req.query['surName']);
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		var command = "SELECT * from USER_DETAILS where givenname='" + req.query['name'] + "' and surname='" + req.query['surName'] + "'";
		console.log(command);
		client.query(command, function(err, result) {
			done();
			if(err) { console.error(err); res.send("Error :" + err);
			} else {
				res.render('pages/user', {results:result.rows});
			}
		});
	});
	/*
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		console.log(req);
		console.log(req.query('givenName'));
		console.log(req.query('surName'));
		console.log(req.text.givenName);
		console.log(req.text.surName);
		var command = 'SELECT * from USER_DETAILS where givenname=' + req.params.givenName + " and surname=" + req.params.surName;
		console.log(command);
		client.query(command, function(err, result) {
			done();
			if(err) {
				console.error(err); res.send("Error :" + err);
			}
			else {
				res.render('pages/user', {results:result.rows});
			}	
		});
	});*/
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
