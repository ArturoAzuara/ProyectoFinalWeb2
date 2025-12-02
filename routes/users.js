var express = require('express');
var router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        if(!req.session.userId){
            return res.redirect('/');
        }

        const [rows] = await pool.query(`
            SELECT l.usuario, f.nombre AS cancion, f.album, f.fecha_agregado
            FROM login l
                     LEFT JOIN favoritos f ON l.id = f.usuario_id
            ORDER BY l.usuario, f.fecha_agregado DESC
        `);

        const usuarios = {};
        rows.forEach(row => {
            if(!usuarios[row.usuario]){
                usuarios[row.usuario] = [];
            }
            if(row.cancion) {
                const fecha = new Date(row.fecha_agregado);
                const dd = String(fecha.getDate()).padStart(2, '0');
                const mm = String(fecha.getMonth() + 1).padStart(2, '0');
                const aa = fecha.getFullYear();
                const fechaFormateada = `${dd}-${mm}-${aa}`;

                usuarios[row.usuario].push({
                    nombre: row.cancion,
                    album: row.album,
                    fecha: fechaFormateada
                });
            }
        });

        res.render('usuarios', { usuarios });

    } catch (error) {
        console.error(error);
        res.send("Error al cargar usuarios");
    }
});

module.exports = router;
