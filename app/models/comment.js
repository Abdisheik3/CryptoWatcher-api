const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
	{   
        owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		comment: {
			type: String,
			required: true,
		},
		coinId: {
            type: String,
            required: true
        },
		email: String

	},
	{
		timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
	}
)


module.exports = mongoose.model('Comment', commentSchema)