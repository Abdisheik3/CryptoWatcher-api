const express = require('express')
const passport = require('passport')
const Coin = require('../models/coin')
const User = require('../models/user')
const axios = require('axios')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()


router.get('/coins', requireToken, (req, res, next) => {
	axios.find('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false')
		.then((coins) => {
			return coins.map((coin) => coin.toObject())
		})
		.then((coins) => res.status(200).json({ coins: coins }))
		.catch(next)
})

router.get('/coins/search/:name', (req, res, next) => {
    const name = req.params.name
    axios.get(`https://api.coingecko.com/api/v3/coins/search/&format=json&query="${name}"&resources=coin&limit=25`)
        .then(handle404)
        .then(apiRes => {
            res.body = apiRes.data.results
            return res
        })
        .then((res) => res.status(200).json({results : res.body}))

        .catch(next)

})


router.get('/coins/watchlist/:id', (req, res, next) => {
    const id = req.params.id
    Coin.findOne({ id: id })
        // .then(handle404)
        .then((coin) => 
            res.status(200).json({ coin: coin }))
        .catch(next)
})


// SHOW page for individual coin
router.get('/coins/:id', (req, res, next) => {
    const id = req.params.id
    axios.get(`https://api.coingecko.com/api/v3/coins/${id}`)
        .then(handle404)
        .then(apiRes => {
            res.body = apiRes.data.results
            return res
        })
        .then(res => res.status(200).json({results : res.body}))
        .catch(next)
})


module.exports = router
