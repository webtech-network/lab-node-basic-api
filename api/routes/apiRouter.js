
const express = require ('express')
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
let apiRouter = express.Router()

require ('dotenv').config()



const endpoint = '/'

const knex = require('knex')({
    client : 'pg',
    debug: true,
    connection : {
        connectionString: process.env.DATABASE_URL,                           //Requisição para conexão ao banco de dados, passando as credencias por parâmetro
        ssl: {rejectUnauthorized: false},
    }
});



let checkToken = (req, res, next) => {
    let authToken = req.headers["authorization"]
    if (!authToken) {
        return res.status(401).json({ message: 'Token de acesso requerida' })
    }
    
    let token = authToken.split(' ')[1]
    req.token = token

    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if (err) {
            return res.status(401).json({ message: 'Acesso negado'})
           
        }
        req.usuarioId = decodeToken.id
        next()
    })
}

let isAdmin = (req, res, next) => {
    knex
        .select ('*').from ('usuarios').where({ id: req.usuarioId })
        .then ((usuarios) => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let roles = usuario.roles.split(';')
                let adminRole = roles.find(i => i === 'ADMIN')
                if (adminRole === 'ADMIN') {
                    next()
                    return
                }
                else {
                    res.status(403).json({ message: 'Role de ADMIN requerida' })
                    return
                }
            } else {
                res.status(404).json({message: 'Usuário não encontrado'})
            }
        })
        .catch (err => {
             res.status(500).json({
              message: 'Erro ao verificar roles de usuário - ' + err.message })
        })
}









apiRouter.get(endpoint + 'produtos', checkToken, (req, res) => {
    knex.select('*').from('produtos')
    .then( produtos => res.status(200).json(produtos) )                       //Rota GET, utilizada para obter informações de um produto.
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar produtos - ' + err.message })
    })
})
    
apiRouter.get(endpoint + 'produtos/:id', checkToken,(req, res) => {
    knex.select('*').from('produtos').where({ id: req.params.id })         
    .then(produtos => {
        if (produtos.length > 0) {                                            //Rota GET, para obter um produto a partir do ID
            res.status(200).json(produtos[0])
        } else {
            res.status(404).json({ message: 'Produto não encontrado' })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar produto - ' + err.message 
        })
    })
})

apiRouter.post(endpoint + 'produtos', checkToken, isAdmin, (req, res) => {   //Rota POST, para a criação de um produto, apenas admins tem acesso a ela.
    knex('produtos')
    .insert({
        descricao: req.body.descricao,
        valor: req.body.valor,
        marca: req.body.marca
    }, ['id'])
    .then(result => {
        let produto = result[0]
        res.status(201).json({ id: produto.id })
    })
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao criar produto - ' + err.message 
        })
    })
})

apiRouter.put(endpoint + 'produtos/:id', checkToken, isAdmin, (req, res) => {  //Rota PUT, para atualização dos dados de um produto já existente. Apenas admins tem acesso a mesma.
    knex('produtos')
    .where({ id: req.params.id })
    .update({
        descricao: req.body.descricao,
        valor: req.body.valor,
        marca: req.body.marca
    })
    .then(() => {
        res.status(200).json({ message: 'Produto atualizado com sucesso' })
    })
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao atualizar produto - ' + err.message 
        })
    })
})

apiRouter.delete(endpoint + 'produtos/:id', checkToken, isAdmin, (req, res) => {  //Rota DELETE, remove uma instância e suas informações do banco de dados.
    knex('produtos')
    .where({ id: req.params.id })
    .del()
    .then(() => {
        res.status(200).json({ message: 'Produto deletado com sucesso' })
    })
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao deletar produto - ' + err.message 
        })
    })
})









apiRouter.post (endpoint + 'seguranca/register', (req, res) => {
    knex ('usuarios')
        .insert({
        nome: req.body.nome,
        login: req.body.login,
        senha: bcrypt.hashSync(req.body.senha, 8),
        email: req.body.email
        }, ['id'])
        .then((result) => {
        let usuario = result[0]                                                  //Middleware para registro de novos usuários na aplicação.
        res.status(200).json({"id": usuario.id })
        return
        })
        .catch(err => {
        res.status(500).json({
        message: 'Erro ao registrar usuario - ' + err.message })
        })
})



apiRouter.post(endpoint + 'seguranca/login', (req, res) => {
    knex
        .select('*').from('usuarios').where( { login: req.body.login })
        .then( usuarios => {
            if(usuarios.length){
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync (req.body.senha, usuario.senha)
                if (checkSenha) {
                var tokenJWT = jwt.sign({ id: usuario.id },
                    process.env.SECRET_KEY, {
                    expiresIn: 3600
                    })
              return res.status(200).json ({
                    id: usuario.id,
                    login: usuario.login,
                    nome: usuario.nome,
                    roles: usuario.roles,
                    token: tokenJWT
                    })
                   
                }
            }
           return res.status(401).json({ message: 'Login ou senha incorretos' })
    })
    .catch (err => {
        res.status(500).json({
            message: 'Erro ao verificar login - ' + err.message })
    })
})

apiRouter.get('/test-db', (req, res) => {
    knex.raw('SELECT NOW()')
        .then(result => {
            res.json({ 
                success: true, 
                time: result.rows[0].now,
                env: {
                    hasSecretKey: !!process.env.SECRET_KEY,
                    hasDatabaseUrl: !!process.env.DATABASE_URL,
                    nodeEnv: process.env.NODE_ENV
                }
            });
        })
        .catch(err => {
            res.status(500).json({ 
                success: false, 
                error: err.message 
            });
        });
});





module.exports = apiRouter;


