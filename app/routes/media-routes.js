const IncomingForm = require("formidable").IncomingForm;
const fs = require("fs");

module.exports = function(app, db) {
  // index
  app.get("/media", (req, res) => {
    db.collection("media")
      .find({
        person: req.query.personId
      })
      .toArray(function(err, result) {
        if (err) {
          res.send({ error: "An error occurred" });
        } else {
          res.send(result);
        }
      });
  });

  // uplad media
  app.post("/media", (req, res) => {
    const media = req.body;
    db.collection("media").insertOne(media, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};
