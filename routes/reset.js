var express = require('express');
var router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    if (!req.session.resetUser) return res.redirect('/');
    res.render('reset', { title: "Restablecer contraseña", mensajeError: '' });
});

router.post('/', async (req, res) => {
    const { password, confirmarPassword } = req.body;

    try {
        if (!req.session.resetUser) {
            return res.redirect('/');
        }

        if (!password || !confirmarPassword) {
            return res.render('reset', {
                title: "Restablecer contraseña",
                mensajeError: "Ambos campos son obligatorios"
            });
        }

        if (password !== confirmarPassword) {
            return res.render('reset', {
                title: "Restablecer contraseña",
                mensajeError: "Las contraseñas no coinciden"
            });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.render('reset', {
                title: "Restablecer contraseña",
                mensajeError: "La contraseña debe tener mínimo 8 caracteres, incluir una mayúscula y un número"
            });
        }

        const userId = req.session.resetUser;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.query(
            "UPDATE login SET password = ? WHERE id = ?",
            [hashedPassword, userId]
        );


        req.session.resetUser = null;

        res.render('reset', {
            title: "Restablecer contraseña",
            mensaje: "✅ Contraseña actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña."
        });

    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.render('reset', {
            title: "Restablecer contraseña",
            mensajeError: "Error al actualizar contraseña. Por favor, intenta nuevamente."
        });
    }
});

module.exports = router;