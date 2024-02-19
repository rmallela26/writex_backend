//this is to get the names of all colleges

const College = require('../models/College')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route GET /users
//@access PRIVATE

//create one route for getting one college, and send a parameter the college name for this route
//create another route for getting all college names
const getColleges = asyncHandler(async (req, res) => {
    //IN PRODUCTION MAKE SURE THAT COLLEGE NAMES IN DATABASE ARE SORTED ALPHABETICALLY
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
})

module.exports = {
    getColleges
}
