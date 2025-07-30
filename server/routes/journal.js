const express = require("express");
const { getUser, postEntry, getEntries, getEntriesByMonth, getUserStats} = require("../controllers/journalController");
const { authMiddleware } = require("../middleware/auth");
let router = express.Router();

//see implementation in journalController

router.get("/user/:user", authMiddleware, getUser);
router.get("/entries", authMiddleware, getEntries);
router.get("/entriesbymonth/:email",authMiddleware, getEntriesByMonth);
router.get("/stats/:email",getUserStats);
router.post("/entry/:userId",authMiddleware, postEntry);


module.exports = router
