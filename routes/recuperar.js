var express = require('express');
var router = express.Router();
const pool = require('../db');
const crypto = require('crypto');

router.get('/', (req, res) => {
    res.render('recuperar', { title: "Recuperar contraseña", mensaje: '' });
});

router.post('/', async (req, res) => {
    const { correo } = req.body;

    try {
        if (!correo) {
            return res.render('recuperar', {
                title: "Recuperar contraseña",
                mensaje: "Por favor, ingresa tu correo electrónico"
            });
        }

        const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;
        if (!correoRegex.test(correo)) {
            return res.render('recuperar', {
                title: "Recuperar contraseña",
                mensaje: "El correo debe tener formato válido (debe terminar en .com)"
            });
        }

        const [rows] = await pool.query(
            "SELECT id, usuario FROM login WHERE correo = ?",
            [correo]
        );

        if (rows.length === 0) {
            return res.render('recuperar', {
                title: "Recuperar contraseña",
                mensaje: "Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña."
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000);

        req.session.resetUser = rows[0].id;
        req.session.resetToken = resetToken;
        req.session.resetExpires = resetExpires;

        res.redirect('/reset');

    } catch (error) {
        console.error('Error en recuperación:', error);
        res.render('recuperar', {
            title: "Recuperar contraseña",
            mensaje: "Error al procesar la solicitud. Por favor, intenta nuevamente."
        });
    }
});

module.exports = router;
