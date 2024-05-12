const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const expressAsyncHandler = require('express-async-handler')
const { OAuth2Client, UserRefreshClient } = require('google-auth-library')


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
    // console.log(refreshToken)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if(err) {
                console.log(err)
                return res.status(403).json({ message: "Forbidden" })
            }

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

//@desc google login
//@route POST /auth/google
//@acess PRIVATE (should be logged in at this point)
const googleLogin = async (req, res) => {
    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        'postmessage',
        // "https://www.googleapis.com/auth/drive.file",
    );

    const scopes = ['https://www.googleapis.com/auth/drive.file'];
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', // This ensures you get a refresh token
        scope: scopes,
    });

    const { tokens } = await oAuth2Client.getToken(req.body.code);
    console.log(tokens);
  
    res.json(tokens);
}

//@desc refresh google access token
//@route POST /auth/google-refresh
//@acess PRIVATE (should be logged in at this point)
const googleRefresh = async (req, res) => {

    const user = new UserRefreshClient(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        req.body.refreshToken, //breaking here in frontend because i hardcoded the refresh token instead of using what was sent when initially created in req.body
    );

    console.log("BEARS")
    console.log(user)
    console.log("BEARS")

    //check if refresh token is valid

    try {
        const { credentials } = await user.refreshAccessToken()
        console.log("CREDEDNTIALS")
        console.log(credentials)
        res.json(credentials);
    } catch {
        //refresh token not valid, navigate to google login page
        console.log("NAVIGATE TO GOOGLE LOIGN PAGE")
        return res.status(401).json({ message: 'Unauthorized' })
    }


    // const { credentials } = await user.refreshAccessToken(); // optain new tokens
    // console.log("CREDEDNTIALS")
    // console.log(credentials)
    // res.json(credentials);
}

module.exports = {
    login,
    refresh,
    logout,
    googleLogin,
    googleRefresh
}