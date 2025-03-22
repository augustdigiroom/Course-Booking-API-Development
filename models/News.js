const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'News Name is Required']
    },
    description: {
        type: String,
        required: [true, 'News Description is Required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('News', newsSchema);