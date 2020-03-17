const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    userRating: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    creator: { //creator userId
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Movie', movieSchema);