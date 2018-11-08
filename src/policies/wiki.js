const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  edit() {
    return this._isOwner() || this._isAdmin();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
};
