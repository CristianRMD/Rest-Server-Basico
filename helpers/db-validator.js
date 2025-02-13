const Role = require('../models/roles');
const Usuario = require('../models/usuario'); // Importamos el modelo Usuario

// Verificar si el rol es válido
const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la DB`);
    }
};

// Verificar si el correo ya existe
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado`);
    }
};
const existeUsuarioPorId = async(id) =>{
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
       throw new Error(`El Usuario con  ${id} no existe en la DB`)
       
    };
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}
