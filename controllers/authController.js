const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const expressAsyncHandler = require('express-async-handler')

//@desc login
//@route POST /auth
//@acess public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if(!username || !password) return res.status(400).json({ message: 'All fields are required' })

    const foundUser = await User.findOne({ username }).exec()

    if(!foundUser) return res.status(401).json({ message: 'Unauthorized' })
    const match = await bcrypt.compare(password, foundUser.password)
    if(!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '3599s' }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '3d' }
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 3 * 24 * 60 * 60 * 1000 //3 days
    })

    res.json({ accessToken }) 
})

//@desc refresh
//@route GET /auth/refresh
//@acess public (access token expired)
const refresh = (req, res) => {
    const cookies = req.cookies
    console.log("face")
    if(!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })
    console.log("bears")
    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if(err) return res.status(403).json({ message: "Forbidden" })

            const foundUser = await User.findOne({ username: decoded.username })
            if(!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '3599s' }
            )

            res.json({ accessToken })
        })
    )
}

//@desc refresh
//@route POST /auth/logout
//@acess public (clear cookie) 
const logout = (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(204) //no content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: "Cookie cleared" })

}

module.exports = {
    login,
    refresh,
    logout
}