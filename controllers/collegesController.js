const User = require('../models/User')
const College = require('../models/College')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route GET /users
//@access PRIVATE
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length) {
        return res.status(400).json({ message: "No users found" })
    }
    res.json(users)
})

//@desc create new user
//@route POST /users
//@access PRIVATE
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, colleges } = req.body

    //confirm data is there
    if(!username || !password || !Array.isArray(colleges)) {
        return res.status(400).json({ message: "All fields are required" })
    }

    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if(duplicate) {
        return res.status(409).json({ message: "Duplicate username" })
    }

    const hashedPwd = await bcrypt.hash(password, 10) //10 salt rounds

    const userObject = { username, "password": hashedPwd, colleges}

    //create and store user
    const user = await User.create(userObject)

    if(user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: "Invalid user data recieved" })
    }
})

//@desc update a user
//@route PATCH /users
//@access PRIVATE
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, colleges, password } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(colleges)) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.colleges = colleges

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

//@desc delete a user
//@route DELETE /users
//@access PRIVATE
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}