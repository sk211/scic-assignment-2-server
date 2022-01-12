const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId;
// const port = process.env.PORT || 5000;
const port = 5000
require("dotenv").config();

// medial ware

app.use(cors());
app.use(express.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSOWRD}@cluster0.xo5p1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSOWRD}@cluster0.4bmge.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// all quary is here
async function run() {
  try {
    await client.connect();

    const productsCollection = client.db("scic-2nd").collection("products");
    const orderCollection = client.db("scic-2nd").collection("orders");
    const reviewCollection = client.db("scic-2nd").collection("reviews");
    const usersCollection = client.db("scic-2nd").collection("users");

    // post request

    app.post("/addProducts", async (req, res) => {
      const result = await productsCollection.insertOne(req.body);
      res.send(result);
    });

    app.post("/addOrders", async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.send(result);
    });

    app.post("/addReview", async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      res.send(result);
    });
    app.post("/addUsers", async (req, res) => {
      const result = await usersCollection.insertOne(req.body);
      res.send(result);
      console.log(result);
    });

    app.put("/makeAdmin", async (req, res) => {
      const filter = { email: req.body.email };
      const result = await usersCollection.find(filter).toArray();
      console.log(result);
      if (result) {
        const document = await usersCollection.updateOne(filter, {
          $set: { role: "admin" },
        });
      }
    });

    // get request

    app.get("/addProducts", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
    });
    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    });
    app.get("/myOrders/:email", async (req, res) => {
      const result = await orderCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await orderCollection.findOne(query)
      res.json(result);
    })

    // single service
    app.get("/singleProducts/:id", async (req, res) => {
      const result = await productsCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
    });

    // check admin
    app.get("/chackadmin/:email", async (req, res) => {
      const result = await usersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // delete

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const resutl = await orderCollection.deleteOne(query);
      console.log("deleting user With id", resutl);
      res.json(resutl);
    });

    app.delete("/addProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const resutl = await productsCollection.deleteOne(query);
      console.log("deleting user With id", resutl);
      res.json(resutl);
    });

    app.put("/statusUpdate/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const result = await orderCollection.updateOne(filter, {
        $set: {
          status: req.body.status,
        },
      });
      res.send(result);
    });
  } finally {
    // await cllient.close()
  }
}

run().catch(console.dir);

// root serve link

app.get("/", (req, res) => {
  res.send("scic assignment server is running");
});

app.listen(port, () => {
  console.log("Server Running Port", port);
});
