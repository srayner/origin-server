module.exports = function(app, db) {
  // Export tree
  app.get("/tree/export/:id", (req, res) => {
    const treeId = req.param.id;
    db.collection("people")
      .find({ tree: treeId })
      .toArray(function(err, result) {
        if (err) {
          res.send({ error: "An error occurred" });
        } else {
          res.setHeader(
            "Content-disposition",
            "attachment; filename=export.txt"
          );
          res.setHeader("Content-type", "text/plain");
          res.end("Hello, here is a file for you!");
        }
      });
  });
};
