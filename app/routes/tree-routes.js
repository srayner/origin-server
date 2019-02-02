var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  /**
   * Returns all trees.
   */
  app.get("/trees", (req, res) => {
    db.collection("trees")
      .find({})
      .toArray(function(err, result) {
        if (err) {
          res.send({ error: "An error occurred" });
        } else {
          res.send(result);
        }
      });
  });

  /**
   * Creates a new tree.
   */
  app.post("/trees", (req, res) => {
    const tree = req.body;
    db.collection("trees").insertOne(tree, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  /**
   * Returns a single tree.
   */
  app.get("/trees/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: id };
    db.collection("trees").findOne(details, (err, item) => {
      if (err) {
        res.send({ error: "An error has occured." });
      } else {
        res.send(item);
      }
    });
  });

  /**
   * Updates a tree.
   */
  app.patch("/trees/:id", (req, res) => {
    const id = req.params.id;
    const query = { _id: id };
    const update = {
      $set: {
        name: req.body.name
      }
    };
    db.collection("trees").updateOne(query, update, function(err, item) {
      if (err) {
        res.send({ error: "An error has occured." });
      } else {
        res.send({ message: "Tree " + id + " updated." });
      }
    });
  });

  /**
   * Deletes a tree.
   */
  app.delete("/trees/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: id };
    db.collection("trees").remove(details, (err, item) => {
      if (err) {
        res.send({ error: "An error occured" });
      } else {
        res.send({ message: "Tree " + id + " deleted!" });
      }
    });
  });
};
