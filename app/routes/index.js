const personRoutes = require("./person-routes");
const familyRoutes = require("./family-routes");
const treeRoutes = require("./tree-routes");

module.exports = function(app, db) {
  personRoutes(app, db);
  familyRoutes(app, db);
  treeRoutes(app, db);
};
