const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route GET /users
//@access PRIVATE
const getUser = asyncHandler(async (req, res) => {
    const username = req.user;
    console.log(username)

    const user = await User.findOne({ username }).select('-username -_id -password').lean()
    if(!user) {
        return res.status(400).json({ message: "No users found" })
    }
    res.json(user)
})

//@desc create new user
//@route POST /users
//@access PRIVATE
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    //confirm data is there
    if(!username || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if(duplicate) {
        return res.status(409).json({ message: "Duplicate username" })
    }

    const hashedPwd = await bcrypt.hash(password, 10) //10 salt rounds

    const userObject = { username, "password": hashedPwd, "colleges": []}

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
    const { college } = req.body

    console.log("username is ")
    console.log(req.user)
    const username = req.user

    // Confirm data 
    if (!college || Object.keys(college).length === 0) {
        return res.status(400).json({ message: 'All fields required' })
    }

    // Does the user exist to update?
    const user = await User.findOne({ username }).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // // Check for duplicate 
    // const duplicate = await User.findOne({ username }).lean().exec()

    // // Allow updates to the original user 
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: 'Duplicate username' })
    // }

    // user.username = username
    user.colleges = [...user.colleges, college]

    // if (password) {
    //     // Hash password 
    //     user.password = await bcrypt.hash(password, 10) // salt rounds 
    // }

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
    getUser,
    createNewUser,
    updateUser,
    deleteUser
}


