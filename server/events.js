const ObjectId = require("mongodb").ObjectID;

module.exports = (app, eventsCollection) => {
  app.post("/addevents", (req, res) => {
    const allevents = req.body;
    eventsCollection
      .insertMany(allevents)
      .then((res) => res.status(200).send(true))
      .catch((error) => res.status(404).send(false));
  });

  app.get("/allevents", (req, res) => {
    eventsCollection.find({}).toArray((error, documents) => {
      if (!error) {
        res.status(200).send(documents);
        return;
      }
      res.status(404).send("Data not found");
    });
  });

  app.post("/events/add", (req, res) => {
    const event = req.body;
    event.image = "/resources/images/extraVolunteer.png";

    eventsCollection.insertOne(event).then((result) => {
      if (result.insertedCount) {
        res.status(200).send(true);
        return;
      }
      res.status(404).send(false);
    });
  });

  app.get("/events/:id", (req, res) => {
    const eventId = req.params.id;

    eventsCollection
      .findOne({ _id: ObjectId(eventId) })
      .then((event) => res.status(200).send(event))
      .catch((error) => res.status(404).send(false));
  });
};
