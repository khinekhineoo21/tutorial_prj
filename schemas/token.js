const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expired: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    update: {
        password: {
            type: String
        },
        email: {
            type: String
        }
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});

module.exports = mongoose.model("Token", TokenSchema);

