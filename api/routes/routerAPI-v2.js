const express = require ('express')
const routerAPIv2 = express.Router()

const knex = require('knex')({
   client: 'sqlite3',
   connection: {
     filename: './dev.sqlite3'
   }
})

routerAPIv2.use (express.urlencoded())
routerAPIv2.use (express.json())

// Cria um manipulador da rota padrão 
routerAPIv2.get('/produtos', function (req, res) {
  knex.select('*').from('produtos')
  .then (produtos => res.json(produtos))
  .catch (err => res.json ({ message: `Erro ao recuperar produtos: ${err.message}` }))
})
  
// Cria um manipulador da rota padrão 
routerAPIv2.post('/produtos', function (req, res) {
  knex('produtos').insert(req.body, ['id'])
  .then (produtos => {
    let id = produtos[0].id
    res.json({ message: `Produto inserido com sucesso.`, id  })
  })
  .catch (err => res.json ({ message: `Erro ao inserir produto: ${err.message}` }))
})


module.exports = routerAPIv2