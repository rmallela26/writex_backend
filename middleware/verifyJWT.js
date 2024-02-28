const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyJWT = (req, res, next) => {
    
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })

    const token = authHeader.split(' ')[1]
    // console.log(JSON.parse(Buffer.from(token.split('.')[1], 'base64').UserInfo.username))

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if(err) return res.status(403).json({ message: "Forbidden" })
            console.log("over here")
            req.user = decoded.UserInfo.username
            console.log(req.user)
            next()
        })
    )

}

module.exports = verifyJWT