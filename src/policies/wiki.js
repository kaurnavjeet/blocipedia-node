const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  edit() {
    return this.user != null && this.record;
  }

  update() {
    return this.new();
  }

  destroy() {
    return this.update();
  }
};
