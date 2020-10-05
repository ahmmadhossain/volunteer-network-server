const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tsunh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

client.connect((error) => {
  if (error) {
    console.log("Connection error", error);
    return;
  }
  console.log("Database connected");

  const db = client.db(`${process.env.DB_NAME}`);

  const eventsCollection = db.collection("events");
  const volunteersCollection = db.collection("volunteers");

  require("./server/events")(app, eventsCollection);
  require("./server/volunteers")(app, volunteersCollection);
});

app.get("/", (req, res) => {
  res.send("Node.js is running");
});

app.listen(PORT);
