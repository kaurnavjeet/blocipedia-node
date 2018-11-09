const express = require("express");
const router = express.Router();
const validation = require("./validation");
const helper = require("../auth/helpers");

const wikiController = require("../controllers/wikiController");

router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);
router.post(
  "/wikis/create",
  helper.ensureAuthenticated,
  validation.validateWikis,
  wikiController.create
);

module.exports = router;
