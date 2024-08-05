const jwt = require('jsonwebtoken');
const User = require('../models/user')

const handleRefresh = async (req, res) => {
    if (!req.cookies?.jwt) return res.sendStatus(403)
    const cookie = req.cookies.jwt
    const userFound = await User.findOne({ RefreshToken: cookie })
    if (!userFound) return res.sendStatus(403)
    jwt.verify(
        cookie,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log(decoded)
            if (err || userFound.FirstName !== decoded.userInfo.FirstName) return res.sendStatus(403)
            const roles = userFound.Roles
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        FirstName: userFound.FirstName,
                        Roles: roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            )
            return res.status(200).json(accessToken)
        },
    )
}

module.exports = handleRefresh