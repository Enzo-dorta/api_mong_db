const express = require('express');
const router = express.Router(); // ao ser trocado a rota ele permanece as variaveis,de onde vem o caminho, gerencia a rota do contato, o arquivo INTEIRO é sobre um unica rota: rota.get; rota.put; rota.post
const Contato = require('../modelos/contato'); // altera o modelo da busca, mas depende do driver, find é da biblioteca de busca, por isso é importante ler o doc

// Rota para obter todos os contatos
router.get('/', async (req, res) => { // async = serve para fazer uma tarefa no plano de fundo, sendo assim atividades independentes se ativarem em parelelo  await so funciona com async
  try {
    const contatos = await Contato.find(); // vai buscar informações um '#...'/ await= ela cria uma lista de espera, sendo assim não necessario um call back, pois as vezes é necessario um resultado e depois guardo o resultado
    res.json(contatos); // lista de contatos do programa
  } catch (err) { // caso tenha um erro ele devolve um mensagem.
    res.status(500).json({ message: err.message });
  }
});

// Rota para obter um contato por ID
router.get('/:id', getContato, (req, res) => { // ele definira o valor depois da barra, no caso coloca o id, assim devolve o parametro com o tal id mandando a resposta
  res.json(res.contato); // pega o parametro, apos isso ele devolve
});

// Rota para criar um novo contato
router.post('/', async (req, res) => { 
  const contato = new Contato({
    nome: req.body.nome,
    email: req.body.email,
    telefone: req.body.telefone,
    endereco: req.body.endereco,
    foto: req.body.foto,
  });

  try {
    const newContato = await contato.save(); // pega o contato e salva, code 101 usuario criado; caso não consiga exception
    res.status(201).json(newContato);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para atualizar um contato por ID
router.put('/:id', getContato, async (req, res) => {
  if (req.body.nome != null) {
    res.contato.nome = req.body.nome;
  }
  if (req.body.email != null) {
    res.contato.email = req.body.email;
  }
  if (req.body.telefone != null) {
    res.contato.telefone = req.body.telefone;
  }
  if (req.body.endereco != null) {
    res.contato.endereco = req.body.endereco;
  }
  if (req.body.foto != null) {
    res.contato.foto = req.body.foto;
  }

  try {
    const updatedContato = await res.contato.save();
    res.json(updatedContato);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para excluir um contato por ID
router.delete('/:id', getContato, async (req, res) => {
  try {
    await res.contato.deleteOne();
    res.json({ message: 'Contato excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getContato(req, res, next) {
  try {
    const contato = await Contato.findById(req.params.id);
    if (contato == null) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }
    res.contato = contato;
    next(); // ele ignora tudo pra baixo e segue para a proxima função, um 'break' do 'for'
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router; // ele exporta a rota
