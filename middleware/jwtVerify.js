const jwt = require('jsonwebtoken');

const jwtVerify = (req, res, next)=>{
    const header = req.headers?.authorization
    if(!header) return res.status(401).json('Not authorized')
    const cookie = header.split(' ')[1];
    jwt.verify(
        cookie,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded)=>{
            if(err) return res.status(401).json(err)
            req.Email = decoded.userInfo.Email
            req.Roles = decoded.userInfo.Roles
            next()
        }
    )
}
module.exports = jwtVerify;