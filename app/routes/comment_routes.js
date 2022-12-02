const express = require('express')
const passport = require('passport')
const Comment = require('../models/comment')
const coinApi = require('../../config/coinApi')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()
// index for coin comments
router.get('/comments/:coinId', requireToken, (req, res, next) => {
    const coinId = req.params.coinId
    Comment.find( {coinId : coinId})
    .then((comments) => {
        return comments.map((comment) => comment.toObject())
    })
    .then(comments => res.status(200).json({ comments: comments}
    )) 
    .catch(next)

})

// CREATE
// POST /comments
router.post('/comments/:coinId', requireToken, (req, res, next) => {
    const coinId = req.params.coinId

    req.body.comment.owner = req.user.id
    req.body.comment.email = req.user.email
    req.body.comment.coinId = coinId
    // on the front end, I HAVE to send a pet as the top level key
    Comment.create(req.body.comment)
    .then(comment => {
        res.status(201).json({ comment: comment })
    })
    .then(() => {coinApi(coinId)})
    .catch(next)
    // ^^^ shorthand for:
        //^ .catch(error => next(error))
})

// UPDATE
// PATCH /comments/5a7db6c74d55bc51bdf39793
router.patch('/comments/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.comment.owner

	Comment.findById(req.params.id)
		.then(handle404)
		.then((comment) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, comment)

			// pass the result of Mongoose's `.update` to the next `.then`
			return comment.updateOne(req.body.comment)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /comments/5a7db6c74d55bc51bdf39793
router.delete('/comments/:id', requireToken, (req, res, next) => {
	Comment.findById(req.params.id)
		.then(handle404)
		.then((comment) => {
			// throw an error if current user doesn't own `comment`
			requireOwnership(req, comment)
			// delete the comment ONLY IF the above didn't throw
			comment.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router