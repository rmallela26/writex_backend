const mongoose = require('mongoose')
const { __esModule } = require('uuid')

//add counselor role/functionality later 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    colleges: [{
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    }],
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('User', userSchema)