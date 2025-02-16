const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No existe Token en la petición'
        });
    }

    try {
        // Verificar la validez del token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        // Validar si el usuario existe en la BD
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en BD'
            });
        }

        // Validar si el usuario está activo
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario inactivo'
            });
        }

        // Almacenar en la req el usuario autenticado
        req.usuario = usuario;
        req.uid = uid;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}




module.exports = {
    validarJWT
}
