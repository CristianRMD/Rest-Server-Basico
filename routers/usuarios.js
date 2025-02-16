const {Router} = require('express');
const { check } = require('express-validator');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validator');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controller/usuarios');

const router = Router();
const {validarCampos,validarJWT,
    esAdminRole, tieneRole
} = require('../middlewares');


router.get('/', usuariosGet )

router.put('/:id',[
    check('id','No es un ID valido ').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut );



router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),  // Aquí agregamos la validación del correo
    check('password', 'El password debe tener mínimo 6 caracteres').isLength({ min: 6 }),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);







router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id','No es un ID valido ').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete  );





router.patch('/', usuariosPatch);

module.exports = router;
