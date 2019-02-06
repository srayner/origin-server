var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  // INDEX Families
  app.get("/families", (req, res) => {
    db.collection("families")
      .find({
        tree: req.query.tree
      })
      .toArray(function(err, result) {
        if (err) {
          res.send({ error: "An error occurred" });
        } else {
          res.send(result);
        }
      });
  });

  // CREATE Family
  app.post("/families", (req, res) => {
    const family = req.body;
    db.collection("families").insertOne(family, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  // READ Family
  app.get("/families/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: id };
    db.collection("families").findOne(details, (err, item) => {
      if (err) {
        res.send({ error: "An error has occured." });
      } else {
        res.send(item);
      }
    });
  });

  // UPDATE Family
  app.patch("/families/:id", (req, res) => {
    const id = req.params.id;
    const query = { _id: id };
    const update = {
      $set: {
        father: req.body.father,
        mother: req.body.mother,
        children: req.body.children
      }
    };
    db.collection("families").updateOne(query, update, function(err, item) {
      if (err) {
        res.send({ error: "An error has occured." });
      } else {
        res.send({ message: "Family " + id + " updated." });
      }
    });
  });

  // DELETE Family
  app.delete("/families/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: id };
    db.collection("families").remove(details, (err, item) => {
      if (err) {
        res.send({ error: "An error occured" });
      } else {
        res.send({ message: "Family " + id + " deleted!" });
      }
    });
  });
};
