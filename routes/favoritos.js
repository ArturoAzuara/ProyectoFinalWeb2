var express = require('express');
var router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        if(!req.session.userId){
            return res.redirect('/');
        }

        const [rows] = await pool.query(
            "SELECT * FROM favoritos WHERE usuario_id = ? ORDER BY CAST(playlist AS UNSIGNED) ASC, fecha_agregado DESC",
            [req.session.userId]
        );

        res.render('favoritos', { canciones: rows });
    } catch (error) {
        console.error(error);
        res.send("Error al cargar favoritos");
    }
});

router.post('/agregar', async (req, res) => {
    try {
        if(!req.session.userId) return res.json({ success: false });

        const { nombre, artista, audio, portada, album } = req.body;

        const [countResult] = await pool.query(
            "SELECT COUNT(*) as total FROM favoritos WHERE usuario_id = ?",
            [req.session.userId]
        );

        const nuevaPosicion = countResult[0].total;

        await pool.query(
            "INSERT INTO favoritos (usuario_id, nombre, artista, audio, portada, album, fecha_agregado, playlist) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)",
            [req.session.userId, nombre, artista, audio, portada, album, nuevaPosicion]
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

router.post('/eliminar', async (req, res) => {
    try {
        const { id } = req.body;
        await pool.query(
            "DELETE FROM favoritos WHERE id = ? AND usuario_id = ?",
            [id, req.session.userId]
        );

        await reordenarPlaylist(req.session.userId);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

router.post('/reordenar', async (req, res) => {
    try {
        if(!req.session.userId) return res.json({ success: false });

        const { orden } = req.body;

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            for (const item of orden) {
                await connection.query(
                    "UPDATE favoritos SET playlist = ? WHERE id = ? AND usuario_id = ?",
                    [item.nuevaPosicion, item.id, req.session.userId]
                );
            }

            await connection.commit();
            res.json({ success: true, message: 'Orden actualizado en playlist' });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error al reordenar:', error);
        res.json({ success: false, message: 'Error al guardar el orden' });
    }
});

async function reordenarPlaylist(usuarioId) {
    try {
        const [favoritos] = await pool.query(
            "SELECT id FROM favoritos WHERE usuario_id = ? ORDER BY CAST(playlist AS UNSIGNED) ASC",
            [usuarioId]
        );

        for (let i = 0; i < favoritos.length; i++) {
            await pool.query(
                "UPDATE favoritos SET playlist = ? WHERE id = ? AND usuario_id = ?",
                [i, favoritos[i].id, usuarioId]
            );
        }

        console.log(`Playlist reordenada para usuario ${usuarioId}`);
    } catch (error) {
        console.error('Error al reordenar playlist:', error);
    }
}

module.exports = router;