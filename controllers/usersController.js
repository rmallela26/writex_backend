const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all college,doc pairs for a user
//@route GET /users
//@access PRIVATE
const getUser = asyncHandler(async (req, res) => {
    const username = req.user;
    console.log(username)

    const user = await User.findOne({ username }).select('-username -password').lean()
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

    const userObject = { username, "password": hashedPwd, "colleges": [], "activities": [], "accessToken": "", "refreshToken": ""}

    //create and store user
    const user = await User.create(userObject)

    if(user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: "Invalid user data recieved" })
    }
})

//@desc update a user to add college
//@route PATCH /users/add
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

    // user.username = username
    user.colleges = [...user.colleges, college]

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

//@desc update a user to delete college
//@route PATCH /users/delete
//@access PRIVATE
const updateUserDelete = asyncHandler(async (req, res) => {
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

    // find college and remove
    const index = user.colleges.findIndex(x => x.name === college)
    if (index > -1) { // only splice array when item is found
        user.colleges.splice(index, 1); // 2nd parameter means remove one item only
    }

    console.log(user.colleges)
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

//@desc set google access and refresh tokens
//@route PATCH /users/google-tokens
//@access PRIVATE
const setTokens = asyncHandler(async (req, res) => {
    if(!req.body.accessToken) res.status(400).json({ message: "All fields required" })

    const username = req.user
    const user = await User.findOne({ username }).exec()
    if(!user) {
        return res.status(400).json({ message: "No users found" })
    }

    user.accessToken = req.body.accessToken
    if(req.body.refreshToken) user.refreshToken = req.body.refreshToken

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

//@desc get access token
//@route GET /users/google-access
//@access PRIVATE
const getAccessToken = asyncHandler(async (req, res) => {
    const username = req.user;

    const user = await User.findOne({ username }).select('accessToken').lean()
    if(!user) {
        return res.status(400).json({ message: "No users found" })
    }
    res.json(user)
})

//@desc get refresh token
//@route GET /users/google-refresh
//@access PRIVATE
const getRefreshToken = asyncHandler(async (req, res) => {
    const username = req.user;

    const user = await User.findOne({ username }).select('refreshToken').lean()
    if(!user) {
        return res.status(400).json({ message: "No users found" })
    }
    res.json(user)
})

//@desc Get all activties docs for a user
//@route GET /users/activities
//@access PRIVATE
const getUserActivities = asyncHandler(async (req, res) => {
    const username = req.user;
    console.log(username)

    const user = await User.findOne({ username }).select('activities').lean()
    if(!user) {
        return res.status(400).json({ message: "No users found" })
    }
    console.log(user.activities)
    res.json(user)
})

//@desc add activties docs for a user
//@route POST /users/activities
//@access PRIVATE
const addUserActivities = asyncHandler(async (req, res) => {
    const { activities } = req.body
    const username = req.user;

    if(!activities) res.status(400).json({ message: "All fields are required" })

    console.log(username)

    const user = await User.findOne({ username }).select('activities').exec()
    if(!user) {
        return res.status(400).json({ message: "No users found" })
    }
    
    user.activities = activities

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

module.exports = {
    getUser,
    createNewUser,
    updateUser,
    updateUserDelete,
    deleteUser,
    setTokens,
    getAccessToken,
    getRefreshToken,
    getUserActivities,
    addUserActivities
}


