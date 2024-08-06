const User = require('../models/user');
const bcrypt = require('bcrypt');
const salt = 10;
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { Email, Password } = req.body
    if (!Email || !Password) return res.sendStatus(400)
    const userFound = await User.findOne({ Email: Email })
    if(!userFound) return res.sendStatus(400)
    const match = await bcrypt.compare(Password, userFound.Password)
    const FirstName = userFound.FirstName
    if(match){
        const Roles = userFound.Roles;
        const REFRESH_TOKEN = jwt.sign(
            {
                userInfo:{
                    FirstName: FirstName,
                    Roles: Roles,
                    Email: userFound.Email
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'24h' }
        )
        const ACCESS_TOKEN = jwt.sign(
            {
                userInfo:{
                    FirstName: FirstName,
                    Roles: Roles,
                    Email: userFound.Email
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'24h'}
        )
        userFound.RefreshToken = REFRESH_TOKEN
        const result = await userFound.save()
        console.log(result);
        res.cookie('jwt', REFRESH_TOKEN, {httpOnly:true, expiresIn: '24h'})
        res.status(200).json({ACCESS_TOKEN, Roles, FirstName})
    }
    else return res.sendStatus(403)
}

module.exports = handleLogin;