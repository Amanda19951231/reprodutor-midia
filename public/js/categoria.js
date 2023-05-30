// Evento de clique no botão "Salvar" no modal de adicionar categoria
document.getElementById('btnSalvarCategoria').addEventListener('click', adicionarCategoria);

// Função para adicionar uma nova categoria
function adicionarCategoria() {
  const nomeCategoria = document.getElementById('categoria').value;

  // Verifique se o nome da categoria foi fornecido
  if (!nomeCategoria) {
    alert('O nome da categoria é obrigatório');
    return;
  }

  // Enviar uma requisição POST para a rota /categorias no servidor
  fetch('/categorias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome: nomeCategoria }),
  })
    .then(response => response.json())
    .then(data => {
      alert(data.mensagem);
      // Lógica adicional após adicionar a categoria, se necessário
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

// Função para exibir todas as categorias
function exibirCategorias() {
  // Enviar uma requisição GET para a rota /categorias no servidor
  fetch('/categorias')
    .then(response => response.json())
    .then(data => {
      // Lógica para exibir as categorias na página HTML
      const tabelaCategorias = document.getElementById('tabelaCategorias');
      tabelaCategorias.innerHTML = '';

      data.forEach(categoria => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${categoria.nome}</td>
          <td>
            <button onclick="editarCategoria('${categoria.id}')">Editar</button>
            <button onclick="excluirCategoria('${categoria.id}')">Excluir</button>
          </td>
        `;

        tabelaCategorias.appendChild(linha);
      });
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

// Função para editar uma categoria
function editarCategoria(id) {
  const novoNome = prompt('Digite o novo nome da categoria:');

  // Verifique se o nome foi fornecido
  if (!novoNome) {
    alert('O novo nome da categoria é obrigatório');
    return;
  }

  // Enviar uma requisição PUT para a rota /categorias/:id no servidor
  fetch(`/categorias/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome: novoNome }),
  })
    .then(response => response.json())
    .then(data => {
      alert(data.mensagem);
      // Lógica adicional após editar a categoria, se necessário
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

// Função para excluir uma categoria
function excluirCategoria(id) {
  // Enviar uma requisição DELETE para a rota /categorias/:id no servidor
  fetch(`/categorias/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      alert(data.mensagem);
      // Lógica adicional após excluir a categoria, se necessário
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}
