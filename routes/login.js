var express = require('express');
var router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('login', { title: 'Bienvenido', mensajeError: '' });
});

router.post('/', async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM login WHERE usuario = ?",
            [usuario]
        );

        if (rows.length === 0) {
            const [rowsCorreo] = await pool.query(
                "SELECT * FROM login WHERE correo = ?",
                [usuario]
            );

            if (rowsCorreo.length === 0) {
                return res.render('login', {
                    title: 'Bienvenido',
                    mensajeError: 'Usuario o contraseña incorrectos'
                });
            }

            const user = rowsCorreo[0];

            if (user.password.length > 50) {
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return res.render('login', {
                        title: 'Bienvenido',
                        mensajeError: 'Usuario o contraseña incorrectos'
                    });
                }
            } else {
                if (user.password !== password) {
                    return res.render('login', {
                        title: 'Bienvenido',
                        mensajeError: 'Usuario o contraseña incorrectos'
                    });
                }
            }

            req.session.userId = user.id;
            req.session.username = user.usuario;
            return res.redirect('/index');
        }
        const user = rows[0];

        if (user.password.length > 50) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.render('login', {
                    title: 'Bienvenido',
                    mensajeError: 'Usuario o contraseña incorrectos'
                });
            }
        } else {

            if (user.password !== password) {
                return res.render('login', {
                    title: 'Bienvenido',
                    mensajeError: 'Usuario o contraseña incorrectos'
                });
            }
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

module.exports = router;
