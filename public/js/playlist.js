const express = require('express');
const router = express.Router();
const playlistFunctions = require('./playlistFunctions');

// Rota para obter todas as playlists
router.get('/', (req, res) => {
  playlistFunctions.getAllPlaylists((err, playlists) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json(playlists);
  });
});

// Rota para adicionar uma nova playlist
router.post('/', (req, res) => {
  const { name } = req.body;

  playlistFunctions.addPlaylist(name, (err, newPlaylist) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.status(201).json(newPlaylist);
  });
});

// Rota para editar uma playlist existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  playlistFunctions.editPlaylist(id, name, (err, playlist) => {
    if (err) {
      if (err.message === 'Playlist não encontrada') {
        return res.status(404).json({ error: 'Playlist não encontrada' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json(playlist);
  });
});

// Rota para deletar uma playlist existente
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  playlistFunctions.deletePlaylist(id, (err) => {
    if (err) {
      if (err.message === 'Playlist não encontrada') {
        return res.status(404).json({ error: 'Playlist não encontrada' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.sendStatus(204);
  });
});

module.exports = router;
