const express = require('express');
const {getClass, registerClass, deleteClass, getClassByCode, verifyConflit}= require('./controllers/classController.js');
const {getUser, registerUser, deleteUser, getUserByEmail}= require('./controllers/userController.js');
const router = express.Router();

router.post('/conflict', verifyConflit);

router.get('/', getClass);
router.post('/', registerClass);
router.delete('/', deleteClass);

router.get('/user', getUser);
router.post('/user', registerUser);
router.delete('/user', deleteUser);

module.exports=router;