var express = require('express');
var router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM login WHERE usuario = ? AND password = ?",
            [usuario, password]
        );

        if (rows.length === 0) {
            return res.render('login', {
                title: 'Bienvenido',
                mensajeError: 'Usuario o contraseña incorrectos'
            });
        }

        req.session.userId = rows[0].id;
        req.session.username = rows[0].usuario;
        res.redirect('/index');

    } catch (error) {
        console.error(error);
        res.render('login', {
            title: 'Bienvenido',
            mensajeError: 'Error al verificar usuario'
        });
    }
});

router.get('/', (req, res) => {
    res.render('login', { title: 'Bienvenido' });
});

module.exports = router;

