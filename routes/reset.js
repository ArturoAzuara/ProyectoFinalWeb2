var express = require('express');
var router = express.Router();
const pool = require('../db');

router.get('/', (req, res) => {
    if (!req.session.resetUser) return res.redirect('/');
    res.render('reset', { title: "Restablecer contraseña" });
});

router.post('/', async (req, res) => {
    const { password } = req.body;

    try {
        const userId = req.session.resetUser;

        await pool.query(
            "UPDATE login SET password = ? WHERE id = ?",
            [password, userId]
        );

        req.session.resetUser = null;

        res.render('reset', {
            title: "Restablecer contraseña",
            mensaje: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        console.error(error);
        res.send("Error al actualizar contraseña");
    }
});

module.exports = router;
