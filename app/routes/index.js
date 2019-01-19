const personRoutes = require("./person-routes");
const familyRoutes = require("./family-routes");

module.exports = function(app, db) {
  personRoutes(app, db);
  familyRoutes(app, db);
};
