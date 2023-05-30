const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const categoriasFilePath = __dirname + '/json/categorias.json';

app.use(express.static('public'));
app.use(express.json());

// Rota raiz que serve o arquivo index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Rota para adicionar uma nova categoria
app.post('/categorias', (req, res) => {
  const { nome } = req.body;

  // Verifique se o nome da categoria foi fornecido
  if (!nome) {
    return res.status(400).json({ mensagem: 'O nome da categoria é obrigatório' });
  }

  // Ler as categorias existentes do arquivo
  let categorias = [];
  try {
    const categoriasData = fs.readFileSync(categoriasFilePath, 'utf-8');
    categorias = JSON.parse(categoriasData);
  } catch (error) {
    console.error('Erro ao ler o arquivo de categorias:', error);
    return res.status(500).json({ mensagem: 'Erro ao adicionar a categoria' });
  }

  // Gerar um novo ID para a categoria
  const novaCategoria = {
    id: Date.now().toString(),
    nome: nome
  };

  // Adicionar a nova categoria ao array de categorias
  categorias.push(novaCategoria);

  // Salvar as categorias atualizadas no arquivo
  try {
    fs.writeFileSync(categoriasFilePath, JSON.stringify(categorias, null, 2));
  } catch (error) {
    console.error('Erro ao salvar o arquivo de categorias:', error);
    return res.status(500).json({ mensagem: 'Erro ao adicionar a categoria' });
  }

  res.status(201).json({ mensagem: 'Categoria adicionada com sucesso' });
});

// Rota para obter todas as categorias
app.get('/categorias', (req, res) => {
  let categorias = [];

  // Ler as categorias do arquivo
  try {
    const categoriasData = fs.readFileSync(categoriasFilePath, 'utf-8');
    categorias = JSON.parse(categoriasData);
  } catch (error) {
    console.error('Erro ao ler o arquivo de categorias:', error);
    return res.status(500).json({ mensagem: 'Erro ao obter as categorias' });
  }

  res.json(categorias);
});

// Rota para remover uma categoria
app.delete('/categorias/:id', (req, res) => {
  const categoriaId = req.params.id;

  // Ler as categorias do arquivo
  let categorias = [];
  try {
    const categoriasData = fs.readFileSync(categoriasFilePath, 'utf-8');
    categorias = JSON.parse(categoriasData);
  } catch (error) {
    console.error('Erro ao ler o arquivo de categorias:', error);
    return res.status(500).json({ mensagem: 'Erro ao remover a categoria' });
  }

  // Encontrar a categoria pelo ID
  const categoriaIndex = categorias.findIndex(categoria => categoria.id === categoriaId);

  // Verificar se a categoria foi encontrada
  if (categoriaIndex === -1) {
    return res.status(404).json({ mensagem: 'Categoria não encontrada' });
  }

  // Remover a categoria do array
  categorias.splice(categoriaIndex, 1);

  // Salvar as categorias atualizadas no arquivo
  try {
    fs.writeFileSync(categoriasFilePath, JSON.stringify(categorias, null, 2));
  } catch (error) {
    console.error('Erro ao salvar o arquivo de categorias:', error);
    return res.status(500).json({ mensagem: 'Erro ao remover a categoria' });
  }

  res.json({ mensagem: 'Categoria removida com sucesso' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
