const mongoose = require('mongoose')

//add image, location later 
const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    essays: [{
        type: String,
        required: true
    }],
    logo: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('College', collegeSchema)