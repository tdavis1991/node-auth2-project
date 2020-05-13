const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../users/users-model')
const restricted = require('../middleware/restricted')

const router = express.Router()

router.post('/register', async (req, res, next) => {
    try {
        const { username } = req.body
        const user = await Users.findBy({username}).first()

        if(user) {
            return res.status(409).json({
                message: 'User already exist'
            })
        }
        res.status(201).json(await Users.add(req.body))
    }catch(err) {
        next(err)
    }
})

router.post('/login', async(req, res, next) => {

    const authError = {
        message: 'Invalid information'
    }

    try {
        const user = await Users.findBy({ username: req.body.username }).first()
        if(!user) {
            res.status(401).json(authError)
        }

        const passwordValidation = await bcrypt.compare(req.body.password, user.password)
        if(!passwordValidation) {
            res.status(401).json(authError)
        }

        const tokenPayload = {
            userId: user.id,
            role: 'admin'
        }

        res.cookie('token', jwt.sign(tokenPayload, process.env.JWT_SECRET))
        console.log(user)
        res.json({
            message: `Welcome ${user.username}!`
        })
    }catch(err) {
        next(err)
    }
})

module.exports = router