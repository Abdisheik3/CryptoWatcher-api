const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const coinSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
},
    {
		timestamps: true,
        toObject: { virtuals : true },
        toJSON: { virtuals : true }
	}

)

module.exports = mongoose.model('Coin', coinSchema);