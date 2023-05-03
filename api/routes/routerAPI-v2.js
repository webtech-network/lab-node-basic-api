const express = require ('express')
const routerAPIv2 = express.Router()
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')

const knex = require('knex')({
   client: 'sqlite3',
   connection: {
     filename: './dev.sqlite3'
   }
})

routerAPIv2.use (express.urlencoded({ extended: true }))
routerAPIv2.use (express.json())

const checkToken = (req, res, next) => {
  let authInfo = req.get('authorization')
  console.log(authInfo);
  if (authInfo) {
    const [bearer, token] = authInfo.split(' ')
    
    if (!/Bearer/.test(bearer)) {
      res.status(400).json({ message: 'Tipo de token esperado não informado...', error: true })
      return 
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
        if (err) {
            res.status(401).json({ message: 'Acesso negado'})
            return
        }
        req.usuarioId = decodeToken.id
        req.roles = decodeToken.roles
        next()
    })
  } 
  else
    res.status(401).json({ message: 'Acesso negado'})
}

const isAdmin  = (req, res, next) => {
  if (req.roles?.split(';').includes('ADMIN')){
      next()
  }
  else {
      res.status(403).json({ message: 'Acesso negado'})
  }
}

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

routerAPIv2.post('/seguranca/register', function (req, res) {
  knex('usuarios').insert({
        nome: req.body.nome, 
        login: req.body.login, 
        senha: bcrypt.hashSync(req.body.senha, 8), 
        email: req.body.email,
        roles: "USER"
    }, ['id'])
    .then((result) => {
        let usuario = result[0]
        res.status(200).json({
          "message": "Usuário inserido com sucesso",
          "id": usuario.id }) 
        return
    })
    .catch(err => {
        res.status(500).json({ 
            message: 'Erro ao registrar usuario - ' + err.message })
    })  
})

routerAPIv2.post('/seguranca/login', function (req, res) {
  knex
  .select('*').from('usuarios').where( { login: req.body.login })
  .then( usuarios => {
      if(usuarios.length){
          let usuario = usuarios[0]
          let checkSenha = bcrypt.compareSync (req.body.senha, usuario.senha)
          if (checkSenha) {
             var tokenJWT = jwt.sign({ id: usuario.id, roles: usuario.roles }, 
                  process.env.SECRET_KEY, {
                    expiresIn: 3600
                  })

              res.status(200).json ({
                  id: usuario.id,
                  login: usuario.login, 
                  nome: usuario.nome, 
                  roles: usuario.roles,
                  token: tokenJWT
              })  
              return 
          }
      } 
        
      res.status(401).json({ message: 'Login ou senha incorretos' })
  })
  .catch (err => {
      res.status(500).json({ 
         message: 'Erro ao verificar login - ' + err.message })
  })

})


module.exports = routerAPIv2