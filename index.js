require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.d2ts7wd.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB📚",
    );
    const db = client.db("basicCrud2DB");
    const bookCollection = db.collection("bookCollection");
    const ordersCollection = db.collection("orders");

    app.post("/book", async (req, res) => {
      const newBooks = req.body;
      console.log(newBooks);
      const result = await bookCollection.insertOne(newBooks);
      res.send(result);
    });
    app.get("/books", async (req, res) => {
      const cursor = await bookCollection.find().toArray();
      res.send(cursor);
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      res.send(result);
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedBook = req.body;
      console.log(updatedBook);
      const updatedDoc = {
        $set: {
          bookName: updatedBook.bookName,
          description: updatedBook.description,
          writer: updatedBook.writer,
          price: updatedBook.price,
        },
      };
      const options = { upsert: true };
      const result = await bookCollection.updateOne(
        filter,
        updatedDoc,
        options,
      );
      res.send(result);
    });

    // get all books created by a specific seller
    app.get("/books/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { "seller.email": email };
      const books = await bookCollection.find(query).toArray();
      res.send(books);
    });
    //create a order
    app.post("/order", async (req, res) => {
      const order = req.body;
      console.log(order);
      const result = await ordersCollection.insertOne(order);
      res.send(result);
    });

    //get all orders
    app.get("/orders", async (req, res) => {
      const cursor = await ordersCollection.find().toArray();
      res.send(cursor);
    });

    // get all orders add by a specific user
    app.get("/my-order/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { "customer.email": email };
      const orders = await ordersCollection.find(query).toArray();
      res.send(orders);
    });

    // get all orders add by a specific user
    app.get("/order-request/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { "seller.email": email };
      const result = await ordersCollection.find(query).toArray();
      res.send(result);
    });

    // update a order
    app.patch("/order/:id", async (req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updatedOrder = req.body;
     console.log(updatedOrder);
     const updateDoc = {
       $set:{
         status: updatedOrder.status
       }
     }
     const options = { upsert: true };
      const result = await ordersCollection.updateOne(
        filter,
        updateDoc,
        options,
      );
      res.send(result);

    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from basic CRUD server 🦋");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//
