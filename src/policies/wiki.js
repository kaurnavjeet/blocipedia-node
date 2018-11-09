const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  new() {
    return this.user && this.user.role === 0;
  }

  create() {
    this.new();
  }

  edit() {
    return this.user != null;
  }

  update() {
    return this.edit();
  }
};
