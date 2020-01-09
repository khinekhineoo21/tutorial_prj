const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    postId: {
        type: String,
        required: true,
        unique: true
    },
    postTitle: {
        type: String,
        required: true,
        unique: true  
    },
    postDescription: {
        type: String,
        required: true,
        unique: true 
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
})

module.exports = mongoose.model('Post', PostSchema);