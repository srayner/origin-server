const personRoutes = require("./person-routes");
const familyRoutes = require("./family-routes");
const treeRoutes = require("./tree-routes");
const birthIndexRoutes = require("./birth-index-routes");
const userRoutes = require("./user-routes");
const exportRoutes = require("./export-routes");

module.exports = function(app, db) {
  personRoutes(app, db);
  familyRoutes(app, db);
  treeRoutes(app, db);
  birthIndexRoutes(app, db);
  userRoutes(app, db);
  exportRoutes(app, db);
};
