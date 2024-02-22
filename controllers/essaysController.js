//get all essays for a certain college given by parameter

const College = require('../models/College')
const asyncHandler = require('express-async-handler')

//@desc Get all users
//@route GET /users
//@access PRIVATE

const getEssays = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const college = await College.find({_id:id}).lean()
    return res.json(college[0].essays)
})

module.exports = {
    getEssays
}
