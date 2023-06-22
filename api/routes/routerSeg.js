const express = require ('express')
const routerSeg = express.Router()
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')

const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.development);

routerSeg.use (express.urlencoded({ extended: true }))
routerSeg.use (express.json())

routerSeg.checkToken = (req, res, next) => {
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
  
routerSeg.isAdmin = (req, res, next) => {
    if (req.roles?.split(';').includes('ADMIN')){
        next()
    }
    else {
        res.status(403).json({ message: 'Acesso negado'})
    }
}

routerSeg.post('/register', function (req, res) {
    let { nome, login, senha, email } = req.body
    senha = bcrypt.hashSync(senha, 10)
    knex('usuarios').insert({ nome, login, senha, email, roles: 'USER' }, ['id'])
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

routerSeg.post('/login', function (req, res) {
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


module.exports = routerSeg