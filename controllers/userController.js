const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const salt = 10;
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');


const getUser = async (req, res) => {
    const result = await User.findAll();
    return res.status(200).json(result);
}

//TODO: incrypt password
const registerUser = async (req, res) => {
    const userExist = await User.findByPk(req.body.Email)
    if (userExist) return res.status(400).json("User Already exist");
    const Username = req.body.Username;
    const Password = req.body.Password;
    const Email = req.body.Email;
    if (!Username || !Password || !Email) return res.status(400).json("Some data is empty")
    const REFRESH_TOKEN = jwt.sign(
        {
            userInfo: {
                Username: Username,
                Email: Email,
                Roles: 200
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '24h' }

    )
    const ACCESS_TOKEN = jwt.sign(
        {
            userInfo: {
                userInfo: {
                    Username: Username,
                    Email: Email,
                    Roles: 200
                }
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }

    )
    const result = await User.create({
        RefreshToken: REFRESH_TOKEN,
        Roles: 200,
        Classes: [],
        Username,
        Password,
        Email,
    });
    res.cookie('jwt', REFRESH_TOKEN, { expiresIn: '24h', httpOnly: true })
    return res.json(ACCESS_TOKEN);
}

const deleteUser = async (req, res) => {
    const userFound = await User.findByPk(req.body.Email)
    if (!userFound) return res.status(400).json('User not found')
    await User.destroy({ where: { Email: req.body.Email } })
    return res.status(200).json(`User ${userFound.Email} Deleted`);
}

const getUserByEmail = async (req, res) => {
    // if req.params._id is favicon.ico then response immediately
    if (req.params.id === "favicon.ico") {
        return res.status(404)
    }
    const userFound = await User.findByPk(req.params.Email);
    if (!userFound) return res.status(400).json('User not found');
    return res.status(200).json(userFound);
}


//TODO: THIS NEEDS FIX
const registerClassToUser = async (req, res) => {
    const username = req.body.userInfo;
    const classes = req.body.classes;
    if (!classes) return res.status(400).json('Some data is empty');
    if (!username) return res.status(400).json('Some data is empty');

    const foundUser = await User.findOne({ where: { UserName: username } });

    if (!foundUser) return res.status(400).json('User not found');

    if(!foundUser.Classes || classes.length<7){
        classes.push(...JSON.stringify(foundUser.Classes))
        foundUser.Classes = classes;
        await foundUser.save();
        return res.status(200).json(classes)
    }else{
        if ((foundUser.Classes.length + classes.length) > 6) return res.status(400).json('Numero máximo de matérias é 7');
    }


}

module.exports = { getUser, registerUser, deleteUser, getUserByEmail, registerClassToUser };