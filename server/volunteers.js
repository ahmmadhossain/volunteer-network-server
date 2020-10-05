const ObjectId = require("mongodb").ObjectID;

module.exports = (app, volunteersCollection) => {
  app.post("/volunteer/registration", (req, res) => {
    const event = req.body;

    volunteersCollection
      .insertOne(event)
      .then((result) =>
        res.status(200).send(result.insertedCount ? true : false)
      )
      .catch((error) => res.status(404).send(error.message));
  });

  app.post("/volunteer/registeredevents", (req, res) => {
    const email = req.body.email;
    volunteersCollection
      .find({ email: email })
      .sort({ date: -1 })
      .toArray((error, events) => {
        if (events) {
          res.status(200).send(events);
        } else {
          res.status(404).send("No registered event found");
        }
      });
  });

  app.get("/volunteer/lists", (req, res) => {
    volunteersCollection.find({}).toArray((error, events) => {
      if (!error) {
        res.status(200).send(events);
        return;
      }
      res.status(404).send("Data not found");
    });
  });

  app.delete("/volunteer/event/delete", (req, res) => {
    volunteersCollection
      .deleteOne({ _id: ObjectId(req.body.id) })
      .then((result) => {
        if (result.deletedCount) {
          return res.status(200).send(true);
        }
        return res.status(404).send(false);
      })
      .catch(() => res.status(404).send(false));
  });
};
