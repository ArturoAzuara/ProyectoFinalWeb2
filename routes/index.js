var express = require('express');
var router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const bandas = [
    "Arctic Monkeys",
    "Blur",
    "The Bravery",
    "Cage the Elephant",
    "The Doors",
    "Franz Ferdinand",
    "Gorillaz",
    "Interpol",
    "John Lennon",
    "Joy Division",
    "The Libertines",
    "MGMT",
    "Muse",
    "Oasis",
    "Radiohead",
    "Red Hot Chili Peppers",
    "The Smiths",
    "The Strokes",
];

router.get('/', async (req, res) => {
    try {
        let canciones = [];

        for (let banda of bandas) {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(banda)}&entity=song&limit=5`;
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
            cancionesJSON: JSON.stringify(canciones),
            username: req.session.username || 'Usuario'
        });

    } catch (error) {
        console.log(error);
        res.send("Error al cargar canciones");
    }
});

module.exports = router;