const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()

const port = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hcvpx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();






app.use(cors());
app.use(bodyParser.json());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  const testimonialsCollection = client.db(`${process.env.DB_NAME}`).collection("testimonials");

  app.get('/services',(req,res)=>{
    servicesCollection.find()
    .toArray((err,document)=>{
        res.send(document)
    })
  })


  app.get('/testimonials', (req, res)=>{
    testimonialsCollection.find()
      .toArray((err,document)=>{
          res.send(document)
      })
  })

 

  app.post('/addService',(req, res)=>{
      const service = req.body;
      console.log("new service",service)
      servicesCollection.insertOne(service)
      .then(result =>{
          console.log(result);
          res.send(result.insertedCount > 0)

      })

  })
  // perform actions on the collection object
  console.log("db connencted")
});









app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})