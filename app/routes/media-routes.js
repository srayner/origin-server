const IncomingForm = require("formidable").IncomingForm;
const fs = require("fs");

module.exports = function(app, db) {
  // index
  app.get("/media", (req, res) => {
    db.collection("media")
      .find({
        person: req.query.person
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
    const form = new IncomingForm();
    form.on("file", (field, file) => {
      const path = __dirname + "/../media/uploaded_file";
      fs.rename(file.path, path, function(err) {
        if (err) throw err;
        const media = {
          originalName: file.name,
          type: file.type,
          size: file.size,
          path: path
        };
        db.collection("media").insertOne(media, (err, result) => {});
      });
    });
    form.on("end", () => {
      res.json({ message: "ok" });
    });
    form.parse(req);
  });
};
