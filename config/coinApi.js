const express = require('express')
const Coin = require('../app/models/coin')
const router = express.Router()
const axios = require('axios')
const customErrors = require('../lib/custom_errors')
const handle404 = customErrors.handle404



const coinApi = ( id ) => {
    Coin.find({ id : id})
        .then(coins => {
            if(coins.length === 0) {
                axios.get(`https://api.coingecko.com/api/v3/coins/${id}`)
                .then(handle404)
                .then(apiRes => {
                    const coin = {
                       name: apiRes.data.results.name,
                       price: apiRes.data.results.current_price.usd,
                       image: apiRes.data.results.image.small,
                       id:  apiRes.data.results.id 
                    }
                    return coin
                })
                .then(coin => {
                    Coin.create(coin)
                })
                .catch(console.error)
            } 
        }) 
}

module.exports = coinApi