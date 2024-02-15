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
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'College'
    }]
    
})

module.exports = mongoose.model('User', userSchema)