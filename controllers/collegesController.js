//this is to get the names of all colleges

const College = require('../models/College')
const asyncHandler = require('express-async-handler')

//@desc Get all college names
//@route GET /college-names
//@access PRIVATE
const getCollegeNames = asyncHandler(async (req, res) => {
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

//@desc Get all essays for certain college
//@route GET /essays
//@access PRIVATE
const getEssays = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const college = await College.find({_id:id}).lean()
    return res.json(college[0].essays)
})

module.exports = {
    getCollegeNames,
    getEssays
}
