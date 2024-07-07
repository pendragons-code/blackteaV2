const express = require("express");
const router = express.Router();
const { join } = require("path");

try {
	router.get("/", async (req, res) => {
		res.sendFile(join(__dirname, '../client/public/html/index.html'));
	});
} catch(error) {
	logError(error);
}

module.exports = router;