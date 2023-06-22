const express = require ('express')
const routerAPIv2 = express.Router()
const { checkToken, isAdmin } = require('./routerSeg')
const knex = require('../database');

routerAPIv2.use (express.urlencoded({ extended: true }))
routerAPIv2.use (express.json())

// Cria um manipulador da rota padrão 
routerAPIv2.get('/produtos', checkToken, function (req, res) {
  knex.select('*').from('produtos')
    .then (produtos => res.json(produtos))
    .catch (err => res.json ({ message: `Erro ao recuperar produtos: ${err.message}` }))
})

// Cria um manipulador da rota padrão 
routerAPIv2.get('/produtos/:id', checkToken, function (req, res) {
  let id = req.params.id
  knex.select('*').from('produtos').where({ id })
    .then (produtos => res.json(produtos))
    .catch (err => res.json ({ message: `Erro ao recuperar produtos: ${err.message}` }))
})

// Cria um manipulador da rota padrão 
routerAPIv2.post('/produtos', checkToken, isAdmin, function (req, res) {
  knex('produtos').insert(req.body, ['id'])
  .then (produtos => {
    let id = produtos[0].id
    res.json({ message: `Produto inserido com sucesso.`, id  })
  })
  .catch (err => res.json ({ message: `Erro ao inserir produto: ${err.message}` }))
})

module.exports = routerAPIv2