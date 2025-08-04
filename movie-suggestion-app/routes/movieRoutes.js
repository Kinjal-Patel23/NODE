// const express = require("express");
// const router = express.Router();

// const movieController = require("../controllers/movieController")
// router.get("/home", movieController.getMovie);
// module.exports = router;

const express = require("express");
const router = express.Router();

const movieController = require("../controllers/movieController");

router.get("/home", movieController.getMovie);
router.get("/suggest/:category", movieController.suggestMovie);

module.exports = router;
