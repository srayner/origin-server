module.exports = function(app, db) {
  //INDEX - we probably wont keep this, and just have a search, or make this the search
  app.get("/birth-indexes", (req, res) => {
    const name = req.query.name;
    db.collection("birthIndexes")
      .find({ individualForename: { $regex: name, $options: "gi" } })
      .toArray(function(err, result) {
        console.log(err);
        if (err) {
          res.send({ error: "An error occurred" });
        } else {
          res.send(result);
        }
      });
  });

  //POST birth index
  app.post("/birth-indexes", (req, res) => {
    const birth = req.body;
    db.collection("birthIndexes").insertOne(birth, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};
