const bcrypt = require('bcryptjs')
const db = require('../database/config')

function find() {
    return db("users").select("id", "username")
}

function findById(id) {
    return db("users")
    .where({ id })
    .select("id", "username")
    .first()
}

async function add(user) {
    user.password = await bcrypt.hash(user.password, 14)

    const [id] = await db("users").insert(user)

    return findById(id)
}

function findBy(filter) {
	return db("users")
		.select("id", "username", "password")
		.where(filter)
}

module.exports = {
    find, 
    findById,
    findBy,
    add
}