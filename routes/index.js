var express = require('express');
var router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const bandas = ["Oasis", "The Libertines", "The Smiths", "Muse", "Blur", "Gorillaz", "Radiohead", "Arctic Monkeys", "Suede", "John Lennon"];

router.get('/', async (req, res) => {
    try {
        let canciones = [];

        for (let banda of bandas) {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(banda)}&entity=song&limit=7`;
            const response = await fetch(url);
            const data = await response.json();

            data.results.forEach(track => {
                canciones.push({
                    nombre: track.trackName,
                    artista: track.artistName,
                    audio: track.previewUrl,
                    portada: track.artworkUrl100.replace("100x100bb.jpg","300x300bb.jpg"),
                    album: track.collectionName
                });
            });
        }

        res.render('home', {
            title: 'IndieUnion',
            canciones,
            cancionesJSON: JSON.stringify(canciones)
        });

    } catch (error) {
        console.log(error);
        res.send("Error al cargar canciones");
    }
});

module.exports = router;
