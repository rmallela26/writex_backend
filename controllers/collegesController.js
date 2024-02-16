const College = require('../models/College')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route GET /users
//@access PRIVATE

//create one route for getting one college, and send a parameter the college name for this route
//create another route for getting all college names
const getColleges = asyncHandler(async (req, res) => {
    console.log("here")
    if(req.body.info === "all") { //return all info for a certain college

    } else if (req.body.info === "names") { //return an array of the names with ids
        console.log("names")
        const colleges = await College.find().select('-essays -__v').lean() //just names
        console.log("got here")
        if(!colleges?.length) {
            return res.status(400).json({ message: "No colleges found" })
        }
        let college_list = []
        var num = 0;
        colleges.forEach(college => {
            num += 1;
            college_list.push(
                {
                    id: num,
                    name: college
                }
            )
        });
        return res.json(college_list)
    } else return res.status(400).json({ message: "Bad request" })
})

// //@desc create new user
// //@route POST /users
// //@access PRIVATE
// const createNewUser = asyncHandler(async (req, res) => {
//     const { username, password, colleges } = req.body

//     //confirm data is there
//     if(!username || !password || !Array.isArray(colleges)) {
//         return res.status(400).json({ message: "All fields are required" })
//     }

//     //check for duplicate
//     const duplicate = await User.findOne({ username }).lean().exec()

//     if(duplicate) {
//         return res.status(409).json({ message: "Duplicate username" })
//     }

//     const hashedPwd = await bcrypt.hash(password, 10) //10 salt rounds

//     const userObject = { username, "password": hashedPwd, colleges}

//     //create and store user
//     const user = await User.create(userObject)

//     if(user) {
//         res.status(201).json({ message: `New user ${username} created` })
//     } else {
//         res.status(400).json({ message: "Invalid user data recieved" })
//     }
// })

// //@desc update a user
// //@route PATCH /users
// //@access PRIVATE
// const updateUser = asyncHandler(async (req, res) => {
//     const { id, username, colleges, password } = req.body

//     // Confirm data 
//     if (!id || !username || !Array.isArray(colleges)) {
//         return res.status(400).json({ message: 'All fields except password are required' })
//     }

//     // Does the user exist to update?
//     const user = await User.findById(id).exec()

//     if (!user) {
//         return res.status(400).json({ message: 'User not found' })
//     }

//     // Check for duplicate 
//     const duplicate = await User.findOne({ username }).lean().exec()

//     // Allow updates to the original user 
//     if (duplicate && duplicate?._id.toString() !== id) {
//         return res.status(409).json({ message: 'Duplicate username' })
//     }

//     user.username = username
//     user.colleges = colleges

//     if (password) {
//         // Hash password 
//         user.password = await bcrypt.hash(password, 10) // salt rounds 
//     }

//     const updatedUser = await user.save()

//     res.json({ message: `${updatedUser.username} updated` })
// })

// //@desc delete a user
// //@route DELETE /users
// //@access PRIVATE
// const deleteUser = asyncHandler(async (req, res) => {
//     const { id } = req.body

//     // Confirm data
//     if (!id) {
//         return res.status(400).json({ message: 'User ID Required' })
//     }

//     // Does the user exist to delete?
//     const user = await User.findById(id).exec()

//     if (!user) {
//         return res.status(400).json({ message: 'User not found' })
//     }

//     const result = await user.deleteOne()

//     const reply = `Username ${result.username} with ID ${result._id} deleted`

//     res.json(reply)
// })

module.exports = {
    getColleges
}

// module.exports = {
//     getAllUsers,
//     createNewUser,
//     updateUser,
//     deleteUser
// }