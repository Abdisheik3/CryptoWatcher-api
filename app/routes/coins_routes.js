const express = require('express')
const Coin = require ('../models/coin')
const passport = require('passport')
const User = require('../models/user')
const axios = require('axios')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()



router.get('/coins', (req, res, next) => {
    axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false`)
        .then(handle404)
        .then(apiRes => {
            res.body = apiRes.data.results
            return res
        })
        .then(res => res.status(200).json({results : res.body}))
        .catch(next)
})

module.exports = router