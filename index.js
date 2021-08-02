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
  const bookingCollection = client.db(`${process.env.DB_NAME}`).collection("bookings");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");

  app.get('/services', (req, res) => {
    servicesCollection.find()
      .toArray((err, document) => {
        res.status(200).send(document)
      })
  })


  app.get('/testimonials', (req, res) => {
    testimonialsCollection.find()
      .toArray((err, document) => {
        res.status(200).send(document)
      })
  })

  app.get('/allBookings', (req, res) => {
    bookingCollection.find()
      .toArray((err, document) => {
        res.status(200).send(document)
      })
  })


  app.get('/booking/:id', (req, res) => {
    console.log(req.params.id);
    servicesCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.status(200).send(documents[0])
      })

  })


  app.get('/bookingList', (req, res) => {
    console.log(req.query.email)
    bookingCollection.find({ email: req.query.email })
      .toArray((err, items) => {
        res.status(200).send(items)
      })
  })


  app.post('/addService', (req, res) => {
    const service = req.body;
    console.log("new service", service)
    servicesCollection.insertOne(service)
      .then(result => {
        console.log(result);
        res.status(200).send(result.insertedCount > 0)

      })

  })

  app.post('/addTestimonial', (req, res) => {
    const testimonial = req.body;
    console.log("new service", testimonial)
    testimonialsCollection.insertOne(testimonial)
      .then(result => {
        console.log(result);
        res.status(200).send(result.insertedCount > 0)

      })


  })



  app.post('/booked', (req, res) => {
    const bookingDetail = req.body;
    console.log("booking", bookingDetail)
    bookingCollection.insertOne(bookingDetail)
      .then(result => {
        console.log(result);
        res.status(200).send(result.insertedCount > 0)

      })


  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admin) => {
        res.status(200).send(admin.length > 0);
      })
  })


  app.post('/addAdmin', (req, res) => {
    const admin = req.body;
    console.log("new service", admin)
    adminCollection.insertOne(admin)
      .then(result => {
        console.log(result);
        res.status(200).send(result.insertedCount > 0)

      })


  })

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result);
        res.status(200).send(result.deletedCount > 0)
      })
  })
  // perform actions on the collection object
  console.log("db connencted")
});









app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})