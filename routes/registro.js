var express = require('express');
var router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('registro', { title: 'Registro', mensajeError: '' });
});

router.post('/', async (req, res) => {
    const { usuario, correo, password } = req.body;

    try {
        const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;

        if(!correoRegex.test(correo)) {
            return res.render('registro', {
                title: 'Registro',
                mensajeError: 'El correo debe tener formato: usuario@dominio.com'
            });
        }

        const [usuarioExistente] = await pool.query(
            "SELECT usuario FROM login WHERE usuario = ?",
            [usuario]
        );

        if (usuarioExistente.length > 0) {
            return res.render('registro', {
                title: 'Registro',
                mensajeError: 'El nombre de usuario ya está registrado'
            });
        }

        const [correoExistente] = await pool.query(
            "SELECT correo FROM login WHERE correo = ?",
            [correo]
        );

        if (correoExistente.length > 0) {
            return res.render('registro', {
                title: 'Registro',
                mensajeError: 'El correo electrónico ya está registrado'
            });
        }

        const usuarioRegex = /^[a-zA-Z0-9]{3,20}$/;
        if(!usuarioRegex.test(usuario)) {
            return res.render('registro', {
                title: 'Registro',
                mensajeError: 'El usuario debe tener entre 3 y 20 caracteres (solo letras y números)'
            });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if(!passwordRegex.test(password)) {
            return res.render('registro', {
                title: 'Registro',
                mensajeError: 'Contraseña debe tener mínimo 8 caracteres, incluir una mayúscula y un número'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.query(
            "INSERT INTO login (usuario, correo, password) VALUES (?, ?, ?)",
            [usuario, correo, hashedPassword]
        );

        res.render('login', {
            title: 'Bienvenido',
            mensaje: 'Registro exitoso, ahora inicia sesión'
        });
    } catch (error) {
        console.error(error);
        res.render('registro', {
            title: 'Registro',
            mensajeError: 'Error al registrar usuario'
        });
    }
});

module.exports = router;