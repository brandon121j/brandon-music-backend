const express = require("express");
const router = express.Router();
const { createUser, login, getUserInfo} = require('./controller/userController');

router.post("/create-user", createUser);

router.post('/login', login);

router.get('/user-info', getUserInfo);

module.exports = router;