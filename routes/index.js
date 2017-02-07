var express = require('express');
var router = express.Router();

// import config.js from config directory.  It holds our SQL creds (dl mysql node module first!)
var config = require('../config/config');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.userName,
  password : config.password,
  database : config.database
});

// after this line runs, we are connected to mySQL!
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {

	// init array as a placeholder
	// var taskArray = [];
	var selectQuery = 'SELECT * from tasks'
	connection.query(selectQuery, (error, results, field) =>{
		// res.json(results); //should show an array with all fields in database represented correctly
		res.render('index', { taskArray: results }); //only want to render once we have data from sql - will either be an empty array or an array of objects, depending on query string params
	})

});

// '/addNew' post route - getting data to put into database from form
router.post('/addNew', function(req, res, next) {
	// res.json(req.body);
	var newTask = req.body.newTaskString;
	var taskDate = req.body.newTaskDate;
	// We have a mySQL connection....called connection!
	var insertQuery = "INSERT INTO tasks (task_name, task_date) VALUES ('"+newTask+"','"+taskDate+"')";

	// res.send(insertQuery); - make sure query works - print to console, insert into sequel pro with test data to see if errors occur

	connection.query(insertQuery, (error, results, field) =>{
		if (error) throw error;
		res.redirect('/');
	});
});

////////////////EDIT GET//////////////////

router.get('/edit/:id', (req, res, next)=>{
	// res.send(req.params.id);
	var selectQuery = "SELECT * FROM tasks WHERE id ="+req.params.id;
	// res.send(selectQuery);
	connection.query(selectQuery, (error,results,fields)=>{
		// res.json(results);
		// var date = results[0].task_date;
		var days = results[0].task_date.getDate();
		if(days < 10){
			days = "0"+days;
		}
		var months = results[0].task_date.getMonth() + 1;
		if(months < 10){
			months = "0"+months;
		}		
		var years = results[0].task_date.getFullYear();
		var mysqlDate = years + '-' + months + '-' + days;
		results[0].task_date = mysqlDate;
		// res.json(date);
		res.render('edit', { task:results[0] } );
	});	
});
	

////////////////EDIT POST//////////////////
router.post('/edit/:id', (req, res, next) =>{
	// id is in req.params
	var id = req.params.id;
	// task_name and task_date are in req.body
	// res.send(req.params.id);
	var newTask = req.body.newTaskString;
	var taskDate = req.body.newTaskDate;
	var updateQuery = "UPDATE tasks SET task_name='" + newTask + "', task_date='" + taskDate + "' WHERE ID=" + id;
	res.send(updateQuery);
	// connection.query(updateQuery, (error, results, fields) => {
	// 	res.render('edit', { task: id});
	// })
});

////////////DELETE GET/////////////////
router.get('/delete/:id', (req, res, next) =>{
	var selectQuery = "SELECT * FROM tasks WHERE id = " + req.params.id;
	// res.send(req.params.id);
});

////////////DELETE POST/////////////////
router.post('/delete/:id', (req, res, next) =>{
	res.send(req.params.id);
});


module.exports = router;
//router handles http traffic, just a reminder :)

