const {Router} = require('express');
const { check } = require('express-validator');
const { login } = require('../controller/auth');
const router = Router();

router.post('/login', login );

//const token = await generarJWT(usuario.id);
module.exports = router;

