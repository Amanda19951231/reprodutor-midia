const fs = require('fs');
const path = require('path');

const playlistPath = path.join(__dirname, '../json/playlist.json');

function readPlaylistsFile(callback) {
  fs.readFile(playlistPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo de playlists:', err);
      return callback(err, null);
    }

    const playlists = JSON.parse(data);
    callback(null, playlists);
  });
}

function writePlaylistsFile(playlists, callback) {
  fs.writeFile(playlistPath, JSON.stringify(playlists), (err) => {
    if (err) {
      console.error('Erro ao escrever no arquivo de playlists:', err);
      return callback(err);
    }

    callback(null);
  });
}

// Obtém o elemento do botão "Salvar"
const btnSalvarPlaylist = document.getElementById('btnSalvarPlaylist');

// Adiciona o evento de clique ao botão
btnSalvarPlaylist.addEventListener('click', () => {
  // Obtém o valor do campo de entrada do nome da playlist
  const playlistName = document.getElementById('playlist').value;

  // Chama a função addPlaylist passando o nome da playlist
  addPlaylist(playlistName);
});

// Função para adicionar uma playlist
function addPlaylist(name) {
  // Cria um objeto com o nome da playlist
  const newPlaylist = { name };

  // Realiza uma solicitação HTTP para o seu endpoint de API para adicionar a playlist
  // Você pode usar bibliotecas como Axios ou fetch para isso
  // Exemplo usando fetch:
  fetch('/api/playlists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPlaylist),
  })
    .then(response => response.json())
    .then(addedPlaylist => {
      // Aqui você pode fazer algo com a nova playlist adicionada
      console.log('Nova playlist adicionada:', addedPlaylist);
      // Feche o modal de adicionar playlist, se necessário
      $('#modalAdicionarPlaylist').modal('hide');
    })
    .catch(error => {
      // Lida com erros caso ocorra algum problema na solicitação
      console.error('Erro ao adicionar a playlist:', error);
    });
}


function editPlaylist(id, newName, callback) {
  readPlaylistsFile((err, playlists) => {
    if (err) {
      return callback(err);
    }

    const playlist = playlists.find((pl) => pl.id === id);

    if (!playlist) {
      return callback(new Error('Playlist não encontrada'));
    }

    playlist.name = newName;

    writePlaylistsFile(playlists, (err) => {
      if (err) {
        return callback(err);
      }

      callback(null, playlist);
    });
  });
}

function deletePlaylist(id, callback) {
  readPlaylistsFile((err, playlists) => {
    if (err) {
      return callback(err);
    }

    const playlistIndex = playlists.findIndex((pl) => pl.id === id);

    if (playlistIndex === -1) {
      return callback(new Error('Playlist não encontrada'));
    }

    playlists.splice(playlistIndex, 1);

    writePlaylistsFile(playlists, (err) => {
      if (err) {
        return callback(err);
      }

      callback(null);
    });
  });
}

function getAllPlaylists(callback) {
  readPlaylistsFile((err, playlists) => {
    if (err) {
      return callback(err);
    }

    callback(null, playlists);
  });
}

module.exports = {
  addPlaylist,
  editPlaylist,
  deletePlaylist,
  getAllPlaylists,
};
