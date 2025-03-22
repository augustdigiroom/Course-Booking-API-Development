//[SECTION] Dependencies and Modules
const express = require("express");
const newsController = require("../controllers/news");
const auth = require("../auth");

const {verify, verifyAdmin} = auth;

//[SECTION] Routing Component
const router = express.Router();

//[SECTION] Route for creating a news
router.post("/", verify, verifyAdmin, newsController.addNews);

//[SECTION] Route for retrieving all news
router.get("/all", verify, verifyAdmin, newsController.getAllNews);

//[SECTION] Route for retrieving all active news
router.get("/", newsController.getAllActive);

//[SECTION] Route for retrieving a specific news
router.get("/specific/:newsId", newsController.getNews);

//[SECTION] Route for updating a news (Admin)
router.patch("/:newsId", verify, verifyAdmin, newsController.updateNews);

module.exports = router;