const jwt = require('jsonwebtoken');

const jwtVerify = (req, res, next)=>{
    const header = getCookie("userInfo")
    if(!header) return console.log('aaaaaaaaa');
    const cookie = header.split(' ')[1];
    jwt.verify(
        cookie,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded)=>{
            if(err) return res.status(401).json(err)
            req.Username = decoded.userInfo.Username
            req.Roles = decoded.userInfo.Roles
            next()
        }
    )
}
module.exports = jwtVerify;