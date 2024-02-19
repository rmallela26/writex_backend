//this is to return all information about one college

const College = require('../models/College')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route GET /users
//@access PRIVATE

//take college name as parameter in url
const getCollege = asyncHandler(async (req, res) => {
    
        
})

module.exports = {
    getCollege
}

// module.exports = {
//     getAllUsers,
//     createNewUser,
//     updateUser,
//     deleteUser
// }