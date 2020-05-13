const express = require("express")
const Users = require("./users-model")
const restricted = require("../middleware/restricted")

const router = express.Router()


router.get("/", restricted("admin"), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

module.exports = router