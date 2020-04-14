const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())

const connectionString = 'mongodb+srv://vhreva:rootpassword@cluster0-m6tlw.mongodb.net/test?retryWrites=true&w=majority'


MongoClient.connect(connectionString, { useUnifiedTopology: true })
.then(client => {
  console.log('Connected to Database')
  const db = client.db('create-quotes')
  const quotesCollection = db.collection('quotes')
  app.use(bodyParser.urlencoded({ extended: true }))
  app.get('/', (req, res) => {
    db.collection('quotes').find().toArray()
      .then(results => {
        res.render('index.ejs', { quotes: results })
      })
      .catch(error => console.error(error))
  })
  app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
      .then(result => {
        res.redirect('/')
      })
    .catch(error => console.error(error))
  })
  app.put('/quotes', (req, res) => {
    console.log(req.body)
    quotesCollection.findOneAndUpdate(
      { name: 'Yoda' },
      {
        $set: {
          name: req.body.name,
          quote: req.body.quote
        }
      },
      {
        upsert: true
      }
    )
    .then(result => res.json('Success'))
    .catch(error => console.error(error))
  })
  app.delete('/quotes', (req, res) => {
    quotesCollection.deleteOne(
      { name: req.body.name },
    )
    .then(result => {
      if (result.deletedCount === 0) {
        return res.json('No quote to delete')
      }
      res.json(`Deleted Darth Vadar's quote`)
    })
    .catch(error => console.error(error))
  })
  app.listen(5000, function() {
    console.log('listening on 3000')
  })
})
.catch(console.error)
