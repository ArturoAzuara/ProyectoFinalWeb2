var express = require('express');
var router = express.Router();
const pool = require('../db');

router.get('/', (req, res) => {
    res.render('recuperar', { title: "Recuperar contraseña" });
});

router.post('/', async (req, res) => {
    const { correo } = req.body;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM login WHERE correo = ?",
            [correo]
        );

        if (rows.length === 0) {
            return res.render('recuperar', {
                title: "Recuperar contraseña",
                mensaje: "Ese correo no está registrado"
            });
        }

        req.session.resetUser = rows[0].id;
        res.redirect('/reset');

    } catch (error) {
        console.error(error);
        res.send("Error en recuperación");
    }
});

module.exports = router;
