const IncomingForm = require("formidable").IncomingForm;

module.exports = function(app, db) {
  // uplad media
  app.post("/media", (req, res) => {
    const form = new IncomingForm();
    form.on("file", (field, file) => {
      // Do something with the file
      // e.g. save it to the database
      // you can access it using file.path
    });
    form.on("end", () => {
      res.json();
    });
    form.parse(req);
  });
};
