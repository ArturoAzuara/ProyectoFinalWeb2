var express = require('express');
var router = express.Router();
const pool = require('../db');

router.get('/', (req, res) => {
    res.render('registro', { title: 'Registro' });
});

router.post('/', async (req, res) => {
    const { usuario, correo, password } = req.body;

    try {
        await pool.query(
            "INSERT INTO login (usuario, correo, password) VALUES (?, ?, ?)",
            [usuario, correo, password]
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
