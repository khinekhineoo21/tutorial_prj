const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    authStatus: {
        type: Number,
        required: true
    },
    suspendStatus: {
        type: Number,
        required: true
    },
    userRole: {
        type: Number,
        required: true
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
})

module.exports = mongoose.model('User', UserSchema);