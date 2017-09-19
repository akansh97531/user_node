const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const formidable = require('formidable');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

var db
var edit_id
MongoClient.connect('mongodb://user_data:123456789@ds139124.mlab.com:39124/akansh_db', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.get('/', (req, res) => {
  res.sendFile( __dirname+'/index.html')

})

app.post('/user_info', (req, res) => {
  db.collection('user_info').save(req.body, (err, result) => {
    if (err) return console.log(err)
  })

  db.collection('user_info').find().toArray(function(err, results) {
  	res.send(results)
  })
})


app.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

	xlsxj = require("xlsx-to-json");
	xlsxj({
	  input: files['fileUploaded'].name, 
	  output: "output.json"
	},function(err, result) {
	    if(err) {
	      console.error(err);
	    }else {
	      db.collection('user_info').insertMany(result, function(err, r) {
	      	res.redirect('/')
		  });
	    }
	  });
    });
})



app.post('/delete', (req, res) => {
  db.collection('user_info').remove({"_id": require('mongodb').ObjectId(req.body['_id'])}, (err, result) => {
    if (err) return console.log(err)

	  db.collection('user_info').find().toArray(function(err, results) {
	  	res.send(results)
  })
 })
})



app.post('/get-results', (req, res) => {

	  db.collection('user_info').find().toArray(function(err, results) {
	  	res.send(results)
  	  })
})


app.post('/edit', (req, res) => {
	edit_id =req.body['_id']
	res.render('/edit_new.html');
})


app.post('/edit_new', (req, res) => {
  db.collection('user_info').update({"_id": require('mongodb').ObjectId(edit_id)},req.body, (err, result) => {
    if (err) return console.log(err)
  })


})