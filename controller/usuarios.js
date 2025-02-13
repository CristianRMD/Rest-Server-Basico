const {response, request}= require('express');
const bcryptjs = require('bcryptjs');
const Usuario= require('../models/usuario');
const { validationResult } = require('express-validator');

const usuariosGet = async(req = request, res = response) => {
    // const {q,nombre = 'no envia',apikey} = req.query;
    const {limite=5, desde = 0} = req.query; // indicamos que vamos ha recibir un parametro: limite,con volor por defecto 5
    const query = {estado:true};
    const [total,usuarios] = await Promise.all([
         Usuario.countDocuments(query), //retorna total
         Usuario.find(query) //retorna los usuarios
         .skip(Number(desde))
         .limit(Number(limite))
    ]);
    res.json({
         total,
         usuarios
     });
    //encuentra desde al limite registros de la DB
    /* const usuarios = await Usuario.find(query)
         .skip(Number(desde))
         .limit(Number(limite)); 
     const total = await Usuario.countDocuments(query); */
    
 }
 
 
 
 
 
 



const usuariosPut = async (req, res = response) => {
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL

    try {
        // Validar si el ID es válido en la base de datos
        const usuarioDB = await Usuario.findById(id);
        if (!usuarioDB) {
            return res.status(404).json({
                msg: `No existe un usuario con el ID ${id}`
            });
        }

        // Excluir campos que no deben modificarse (password, google, correo)
        const {_id, password,google,correo, ...resto} = req.body;

        // Si se envía un nuevo password, encriptarlo antes de guardarlo
        if (password) {
            const salt = bcryptjs.genSaltSync(); // Generar salt
            resto.password = bcryptjs.hashSync(password, salt); // Encriptar contraseña
        }

        // Actualizar el usuario y devolver los datos actualizados
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, resto, { new: true });

        res.json({
            msg: '  PUT- API -Controller',
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error en el servidor. Contacte al administrador.'
        });
    }
};



const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password);

    // Guardar en la base de datos
    await usuario.save();

    res.json({
        msg: 'post API - controller',
        usuario
    });
};




const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;
    //borrado fisico.
    //const usuario = await Usuario.findByIdAndDelete(id);
    //borrado logico:
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    res.json({
       usuario
    });
}



const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

//se exporta un objeto pues van haber muchos
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}
