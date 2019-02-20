var ObjectID = require("mongodb").ObjectID;
const checkAuth = require("../middleware/check-auth");

module.exports = function(app, db) {
  /**
   * Returns all trees.
   */
  app.get("/trees", checkAuth, (req, res) => {
    const userId = req.userData.userId;
    db.collection("trees")
      .find({ owner: ObjectID(userId) })
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
  app.post("/trees", checkAuth, (req, res) => {
    const userId = req.userData.userId;
    const tree = req.body;
    tree.owner = ObjectID(userId);
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
  app.get("/trees/:id", checkAuth, (req, res) => {
    const userId = req.userData.userId;
    const id = req.params.id;
    const details = { _id: id, owner: ObjectID(userId) };
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
  app.patch("/trees/:id", checkAuth, (req, res) => {
    const userId = req.userData.userId;
    const id = req.params.id;
    const query = { _id: id };
    db.collection("trees").findOne(query, (err, item) => {
      if (err) {
        res.send({ error: "An error has occured." });
      } else {
        if (!item.owner.equals(ObjectID(userId))) {
          res.send(401, "Unauthorized.");
        } else {
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
        }
      }
    });
  });

  /**
   * Deletes a tree.
   */
  app.delete("/trees/:id", checkAuth, (req, res) => {
    const userId = req.userData.userId;
    const id = req.params.id;
    const query = { _id: id };
    db.collection("trees").findOne(query, (err, item) => {
      if (err) {
        res.send(500, { error: "An error has occured." });
      } else if (!item) {
        res.send(404, { error: "Tree not found." });
      } else {
        if (!item.owner.equals(ObjectID(userId))) {
          res.send(401, "Unauthorized.");
        } else {
          db.collection("trees").remove(query, (err, item) => {
            if (err) {
              res.send({ error: "An error occured" });
            } else {
              res.send({ message: "Tree " + id + " deleted!" });
            }
          });
        }
      }
    });
  });
};
