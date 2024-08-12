const express = require('express');
const {getClass, registerClass, deleteClass, getClassByCode, verifyConflit}= require('./controllers/classController.js');
const {getUser, registerUser, deleteUser, getUserByEmail, registerClassToUser}= require('./controllers/userController.js');
const jwtVerify = require('./middleware/jwtVerify.js');
const handleLogin = require('./controllers/authController.js');
const router = express.Router();
const app = express();

router.post('/conflict', verifyConflit);
router.post('/login', handleLogin);

router.get('/', getClass);
router.post('/', registerClass);
router.delete('/', deleteClass);

router.get('/user', getUser);
router.post('/user', registerUser);
router.post('/registerToUser', registerClassToUser);
router.delete('/user', deleteUser);

router.get('/index', (req, res)=>{
    res.sendFile('C:/Users/wilso/Documents/Trabalho1/public/index.html')
});
router.get('/login', (req, res)=>{
    res.sendFile('C:/Users/wilso/Documents/Trabalho1/public/login.html')

});
module.exports=router;